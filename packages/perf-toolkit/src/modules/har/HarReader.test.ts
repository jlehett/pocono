import HarReader from './HarReader';
import path from 'path';

function getPathToTestFile(fileName: string): string {
    return path.resolve(__dirname, '../../test-data', fileName);
}

describe('HarReader', () => {
    describe('readFile', () => {
        it('should read a HAR file and return it as a JSON object', () => {
            const har = HarReader.readFile(
                getPathToTestFile('developer-mozilla.har'),
            );
            expect(har).toBeDefined();
            expect(har.log).toBeDefined();
            expect(har.log.entries).toBeDefined();
        });

        it('should throw an error if the file does not exist', () => {
            expect(() => {
                HarReader.readFile('does-not-exist.har');
            }).toThrow();
        });
    });

    describe('readPages', () => {
        it('should return the pages from the HAR data', () => {
            const har = HarReader.readFile(
                getPathToTestFile('developer-mozilla.har'),
            );
            const pages = HarReader.readPages(har);

            expect(pages).toEqual([
                {
                    startedDateTime: '2024-08-18T16:34:59.469Z',
                    id: 'page_1',
                    title: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse',
                    pageTimings: {
                        onContentLoad: 969.9350000009872,
                        onLoad: 1866.3419999647886,
                    },
                },
            ]);
        });
    });
});
