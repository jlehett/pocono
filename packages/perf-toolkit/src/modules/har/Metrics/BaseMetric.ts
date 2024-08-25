import { GetMetadataFunction, GetMetricFunction } from '../HarAnalyzer';
import { HarEntry } from '../types/har-file-types';

/**
 * A base class for creating metrics to analyze HAR files.
 */
export default abstract class BaseMetric<ReturnType> {
    /**
     * The name of the metric.
     */
    public abstract readonly name: string;

    /**
     * A function for getting a specific metadata value from the HarAnalyzer that is
     * using this metric. This is used to allow metrics to use metadata if needed.
     */
    public readonly getMetadata: GetMetadataFunction;

    /**
     * A function for getting a specific metric from the HarAnalyzer that is
     * using this metric. This is used to allow metrics to use other metrics
     * if needed.
     */
    public readonly getMetric: GetMetricFunction;

    /**
     * A cache for storing the results of the analysis based on the input HAR entries.
     */
    protected cache: Map<HarEntry[], ReturnType> = new Map();

    public constructor(
        getMetadata: GetMetadataFunction,
        getMetric: GetMetricFunction,
    ) {
        this.getMetadata = getMetadata;
        this.getMetric = getMetric;
    }

    /**
     * Analyze the HAR entries and return the result.
     */
    public abstract analyze(pageId: string, entries: HarEntry[]): ReturnType;

    /**
     * Get the result of the analysis for the given page based on the input HAR entries.
     * If the result has already been calculated, it will be returned from the cache.
     */
    public get(pageId: string, entries: HarEntry[]): ReturnType {
        if (!this.cache.has(entries)) {
            this.cache.set(entries, this.analyze(pageId, entries));
        }

        return this.cache.get(entries) as ReturnType;
    }
}
