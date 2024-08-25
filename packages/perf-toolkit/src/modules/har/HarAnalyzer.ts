import every from 'lodash/every';
import filter from 'lodash/filter';
import HarReader from './HarReader';
import { HarData, HarEntry } from './types/har-file-types';
import metrics, { MetricName, Metric } from './Metrics';
import metadata, { Metadata, MetadataName } from './Metadata';

/**
 * A function for getting a specific metadata value from the HAR file.
 */
export type GetMetadataFunction = <ReturnType>(
    metadataName: MetadataName,
) => ReturnType;

/**
 * A function for getting a specific metric from the HAR file for a specific
 * page ID and set of HAR entries.
 */
export type GetMetricFunction = <ReturnType>(
    metricName: MetricName,
    pageId: string,
    filteredHarEntries?: HarEntry[],
) => ReturnType;

/**
 * A class for analyzing HAR files.
 */
export default class HarAnalyzer {
    /**
     * The raw data from the HAR file.
     */
    public rawData: HarData;

    /**
     * A map of metadata strategies to use for the HAR file.
     */
    private metadataStrategies: Map<string, Metadata> = new Map();

    /**
     * A map of metric strategies to use for analyzing the HAR file.
     */
    private metricStrategies: Map<string, Metric> = new Map();

    /**
     * Initialize the HarAnalyzer with a path to a HAR file in order to begin
     * analyzing the data.
     */
    public constructor(harFilePath: string) {
        this.rawData = HarReader.readFile(harFilePath);

        metadata.forEach((Metadata) => {
            const metadataInstance: Metadata = new Metadata();
            this.metadataStrategies.set(
                metadataInstance.name,
                metadataInstance,
            );
        });

        metrics.forEach((Metric) => {
            const metricInstance: Metric = new Metric(
                this.getMetadata.bind(this),
                this.getMetric.bind(this),
            );
            this.metricStrategies.set(metricInstance.name, metricInstance);
        });
    }

    /**
     * Get a specific metadata value from the HAR file.
     */
    public getMetadata<ReturnType>(metadataName: string): ReturnType {
        const metadata = this.metadataStrategies.get(metadataName);

        if (!metadata) {
            throw new Error(`Metadata "${metadataName}" not found.`);
        }

        return metadata.get(this.rawData) as ReturnType;
    }

    /**
     * Get a specific metric for a given set of HAR entries. If no entries are
     * provided, the full set of entries from the HAR file related to the specified
     * page ID will be used.
     */
    public getMetric<ReturnType>(
        metricName: MetricName,
        pageId: string,
        filteredHarEntries?: HarEntry[],
    ): ReturnType {
        const metric = this.metricStrategies.get(metricName);

        if (!metric) {
            throw new Error(`Metric "${metricName}" not found.`);
        }

        if (!pageId) {
            throw new Error('A page ID must be provided to get a metric.');
        }

        if (
            filteredHarEntries &&
            !every(filteredHarEntries, ['pageref', pageId])
        ) {
            throw new Error(
                'The filtered set of HAR entries must all be related to the specified page ID.',
            );
        }

        return metric.get(
            pageId,
            filteredHarEntries ||
                filter(this.rawData.log.entries, ['pageref', pageId]),
        ) as ReturnType;
    }
}
