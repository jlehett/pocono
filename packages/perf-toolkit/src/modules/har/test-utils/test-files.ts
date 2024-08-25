import path from 'path';

/**
 * Get the path to a given test file.
 */
export function getPathToTestFile(fileName: string): string {
    return path.resolve(__dirname, '../../../test-data', fileName);
}
