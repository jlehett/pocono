import { PageStartTimesMetadata } from '../../Metadata/Implementations/PageStartTimes';
import { HarEntry } from '../../types/har-file-types';
import Timing from '../../utils/Timing';
import BaseMetric from '../BaseMetric';

/**
 * A metric for getting the earliest start time in a HAR file.
 */
export default class StartTime extends BaseMetric<number> {
    public name = 'StartTime' as const;

    /**
     * Get the earliest start time in the given set of HAR entries.
     */
    public analyze(pageId: string, entries: HarEntry[]): number {
        const pageStartTimes = this.getMetadata(
            'PageStartTimes',
        ) as PageStartTimesMetadata;
        const pageStartTime = pageStartTimes[pageId];

        if (!pageStartTime) {
            throw new Error(`Page start time not found for page ID: ${pageId}`);
        }

        return Math.min(
            ...entries.map((entry) =>
                Timing.getEntryTimeRelativeToPageStartTime(
                    pageStartTime,
                    entry.startedDateTime,
                    entry.time,
                ).start.in('ms'),
            ),
        );
    }
}
