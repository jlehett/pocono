import * as fs from 'fs';
import { HarData, HarPage } from './types/har-file-types';

/**
 * A class for reading HAR files.
 */
export default class HarReader {
    /**
     * Read a HAR file and return it as a JSON object.
     */
    public static readFile(filePath: string): HarData {
        const file = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(file);
    }

    /**
     * Get the pages from the HAR data.
     */
    public static readPages(harData: HarData) {
        return harData.log.pages as HarPage[];
    }
}
