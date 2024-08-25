import { HarData, HarPage } from '../../types/har-file-types';
import BaseMetadata from '../BaseMetadata';

/**
 * The start times of each page's monitoring in a HAR file in a key-value format
 * where the key is the page reference and the value is the start time.
 */
export type PageStartTimesMetadata = { [pageRef: string]: string };

/**
 * A metadata for the start times of each page's monitoring in a HAR file.
 */
export default class PageStartTimes extends BaseMetadata<PageStartTimesMetadata> {
    public name = 'PageStartTimes' as const;

    /**
     * Get the start times of each page's monitoring in the given HAR file.
     */
    public compute(harFile: HarData): PageStartTimesMetadata {
        return harFile.log.pages.reduce(
            (startTimesByPageRef: PageStartTimesMetadata, page: HarPage) => ({
                ...startTimesByPageRef,
                [page.id]: page.startedDateTime,
            }),
            {},
        );
    }
}
