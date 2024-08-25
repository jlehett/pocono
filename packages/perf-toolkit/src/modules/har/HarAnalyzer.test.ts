import filter from 'lodash/filter';
import find from 'lodash/find';
import HarAnalyzer from './HarAnalyzer';
import metrics, { MetricName } from './Metrics';
import metadata, { MetadataName } from './Metadata';
import { HarEntry } from './types/har-file-types';
import { getPathToTestFile } from './test-utils/test-files';

describe('HarAnalyzer', () => {
    describe('constructor', () => {
        it('should initialize the raw data from the HAR file', () => {
            const harAnalyzer = new HarAnalyzer(
                getPathToTestFile('developer-mozilla.har'),
            );

            expect(harAnalyzer.rawData).toBeDefined();
            expect(harAnalyzer.rawData.log).toBeDefined();
            expect(harAnalyzer.rawData.log.entries).toBeDefined();
        });

        it.each(metadata.map((metadata) => metadata.name))(
            'should initialize the metadata strategy for %s',
            (metadataName) => {
                const harAnalyzer = new HarAnalyzer(
                    getPathToTestFile('developer-mozilla.har'),
                );
                const metadata = harAnalyzer.getMetadata(
                    metadataName as MetadataName,
                );
                expect(metadata).toBeDefined();
            },
        );

        it.each(metrics.map((metric) => metric.name))(
            'should initialize the metric strategy for %s',
            (metricName) => {
                const harAnalyzer = new HarAnalyzer(
                    getPathToTestFile('developer-mozilla.har'),
                );
                const metric = harAnalyzer.getMetric(
                    metricName as MetricName,
                    'page_1',
                );
                expect(metric).toBeDefined();
            },
        );
    });

    describe('getMetric', () => {
        it('should use all of the HAR entries for the given page in the metric strategy if a filtered set of HAR entries is not provided', () => {
            const harAnalyzer = new HarAnalyzer(
                getPathToTestFile('developer-mozilla-multiple-pages.har'),
            );

            const numRequestsPage1 = harAnalyzer.getMetric(
                'NumRequests',
                'page_11',
            );
            const numRequestsPage2 = harAnalyzer.getMetric(
                'NumRequests',
                'page_10',
            );
            const numRequestsPage3 = harAnalyzer.getMetric(
                'NumRequests',
                'page_12',
            );
            const numRequestsPage4 = harAnalyzer.getMetric(
                'NumRequests',
                'page_13',
            );

            expect(numRequestsPage1).toBe(33);
            expect(numRequestsPage2).toBe(1);
            expect(numRequestsPage3).toBe(37);
            expect(numRequestsPage4).toBe(37);
        });

        it('should use the filtered HAR entries in the metric strategy if they are provided', () => {
            const harAnalyzer = new HarAnalyzer(
                getPathToTestFile('developer-mozilla.har'),
            );
            const filteredHarEntries = harAnalyzer.rawData.log.entries.slice(
                0,
                3,
            );
            const numRequests = harAnalyzer.getMetric(
                'NumRequests',
                'page_1',
                filteredHarEntries,
            );

            expect(numRequests).toBe(3);
        });

        it('should throw an error if the filtered set of HAR entries contains an entry that is not related to the specified page ID', () => {
            const harAnalyzer = new HarAnalyzer(
                getPathToTestFile('developer-mozilla-multiple-pages.har'),
            );
            const filteredHarEntries = filter(harAnalyzer.rawData.log.entries, [
                'pageref',
                'page_11',
            ]).slice(0, 3);

            expect(
                harAnalyzer.getMetric(
                    'NumRequests',
                    'page_11',
                    filteredHarEntries,
                ),
            ).toBe(3);

            filteredHarEntries.push(
                find(
                    harAnalyzer.rawData.log.entries,
                    (entry) => entry.pageref !== 'page_11',
                ) as HarEntry,
            );

            expect(() => {
                harAnalyzer.getMetric(
                    'NumRequests',
                    'page_11',
                    filteredHarEntries,
                );
            }).toThrow();
        });
    });
});
