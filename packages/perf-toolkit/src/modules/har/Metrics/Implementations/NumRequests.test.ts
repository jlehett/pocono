import HarAnalyzer from '../../HarAnalyzer';
import { HarDataFixture } from '../../test-utils/fixtures';
import { getPathToTestFile } from '../../test-utils/test-files';
import NumRequests from './NumRequests';

describe('NumRequests', () => {
    describe('mocked HAR file', () => {
        describe('analyze', () => {
            it('should return the number of requests in the given set of HAR entries', () => {
                const metric = new NumRequests(
                    <ReturnType>(): ReturnType => {
                        return {} as ReturnType;
                    },
                    <ReturnType>(): ReturnType => {
                        return {} as ReturnType;
                    },
                );
                const entries = [
                    HarDataFixture.mockHarEntry(),
                    HarDataFixture.mockHarEntry(),
                    HarDataFixture.mockHarEntry(),
                ];

                const result = metric.analyze('page_1', entries);

                expect(result).toBe(3);
            });
        });
    });

    describe('real HAR file', () => {
        describe('analyze', () => {
            it('should return the number of requests in the given set of HAR entries', () => {
                const harAnalyzer = new HarAnalyzer(
                    getPathToTestFile('developer-mozilla.har'),
                );

                const numRequests = harAnalyzer.getMetric(
                    'NumRequests',
                    'page_1',
                );

                expect(numRequests).toBe(56);
            });
        });
    });
});
