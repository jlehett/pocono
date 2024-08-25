import HarAnalyzer from '../../HarAnalyzer';
import PageStartTimes from '../../Metadata/Implementations/PageStartTimes';
import { HarDataFixture } from '../../test-utils/fixtures';
import { getPathToTestFile } from '../../test-utils/test-files';
import StartTime from './StartTime';

describe('StartTime', () => {
    describe('mocked HAR file', () => {
        describe('analyze', () => {
            it('should return the earliest start time in the given set of HAR entries', () => {
                const harData = HarDataFixture.mockHarData({
                    log: HarDataFixture.mockHarLog({
                        pages: [
                            HarDataFixture.mockHarPage({
                                startedDateTime: '2021-01-01T00:00:00.000Z',
                                id: 'page-1',
                            }),
                        ],
                        entries: [
                            HarDataFixture.mockHarEntry({
                                pageref: 'page-1',
                                startedDateTime: '2023-01-01T00:00:00.000Z',
                            }),
                            HarDataFixture.mockHarEntry({
                                pageref: 'page-1',
                                startedDateTime: '2021-01-01T00:05:21.000Z',
                            }),
                            HarDataFixture.mockHarEntry({
                                pageref: 'page-1',
                                startedDateTime: '2021-01-01T00:05:17.000Z',
                            }),
                            HarDataFixture.mockHarEntry({
                                pageref: 'page-1',
                                startedDateTime: '2021-01-01T01:02:00.000Z',
                            }),
                        ],
                    }),
                });

                const pageStartTimesMetadata = new PageStartTimes();
                const pageStartTimes = pageStartTimesMetadata.compute(harData);

                const metric = new StartTime(
                    <ReturnType>(metadataName: string): ReturnType => {
                        switch (metadataName) {
                            case 'PageStartTimes':
                                return pageStartTimes as ReturnType;
                        }
                        return {} as ReturnType;
                    },
                    <ReturnType>(): ReturnType => {
                        return {} as ReturnType;
                    },
                );

                const result = metric.analyze('page-1', harData.log.entries);

                expect(result).toBe(317000);
            });
        });
    });

    describe('real HAR file', () => {
        describe('analyze', () => {
            it('should return the earliest start time in the given set of HAR entries', () => {
                const harAnalyzer = new HarAnalyzer(
                    getPathToTestFile('developer-mozilla.har'),
                );

                const startTime = harAnalyzer.getMetric('StartTime', 'page_1');

                expect(startTime).toBe(5);
            });
        });
    });
});
