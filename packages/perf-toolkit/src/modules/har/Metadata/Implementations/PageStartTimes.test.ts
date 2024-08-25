import HarAnalyzer from '../../HarAnalyzer';
import { HarDataFixture } from '../../test-utils/fixtures';
import { getPathToTestFile } from '../../test-utils/test-files';
import PageStartTimes from './PageStartTimes';

describe('PageStartTimes', () => {
    describe('mocked HAR file', () => {
        describe('compute', () => {
            it("should return the start times of each page's monitoring in the given HAR file", () => {
                const metadata = new PageStartTimes();
                const harFile = HarDataFixture.mockHarData({
                    log: HarDataFixture.mockHarLog({
                        pages: [
                            HarDataFixture.mockHarPage({
                                id: 'page-1',
                                startedDateTime: '2021-01-01T00:00:00.000Z',
                            }),
                            HarDataFixture.mockHarPage({
                                id: 'page-2',
                                startedDateTime: '2021-01-01T00:00:01.000Z',
                            }),
                            HarDataFixture.mockHarPage({
                                id: 'page-3',
                                startedDateTime: '2021-01-01T00:00:02.000Z',
                            }),
                        ],
                    }),
                });

                const result = metadata.compute(harFile);

                expect(result).toEqual({
                    'page-1': '2021-01-01T00:00:00.000Z',
                    'page-2': '2021-01-01T00:00:01.000Z',
                    'page-3': '2021-01-01T00:00:02.000Z',
                });
            });
        });
    });

    describe('real HAR file', () => {
        describe('compute', () => {
            it("should return the start times of each page's monitoring in the given HAR file", () => {
                const harAnalyzer = new HarAnalyzer(
                    getPathToTestFile('developer-mozilla.har'),
                );

                const pageStartTimes =
                    harAnalyzer.getMetadata('PageStartTimes');

                expect(pageStartTimes).toEqual({
                    page_1: '2024-08-18T16:34:59.469Z',
                });
            });
        });
    });
});
