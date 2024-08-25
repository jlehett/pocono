import { HarEntry } from '../../types/har-file-types';
import BaseMetric from '../BaseMetric';

/**
 * A metric for counting the number of requests in a HAR file.
 */
export default class NumRequests extends BaseMetric<number> {
    public name = 'NumRequests' as const;

    /**
     * Get the number of requests in the given set of HAR entries.
     */
    public analyze(_: string, entries: HarEntry[]): number {
        return entries.length;
    }
}
