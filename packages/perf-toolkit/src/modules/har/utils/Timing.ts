/**
 * Represents a start and end time relative to the start time of a page.
 */
export type RelativeTime = { start: TimeData; end: TimeData };

/**
 * A class providing various time-related utility functions.
 */
export default class Timing {
    /**
     * Get an entry's start and end time in milliseconds since the start time of the page it belongs to.
     */
    public static getEntryTimeRelativeToPageStartTime(
        pageStartTime: string,
        entryStartTime: string,
        entryTime: number,
    ): RelativeTime {
        const pageStart = new Date(pageStartTime).getTime();
        const entryStart = new Date(entryStartTime).getTime();
        const entryEnd = entryStart + entryTime;

        return {
            start: TimeData.set(entryStart - pageStart, 'ms'),
            end: TimeData.set(entryEnd - pageStart, 'ms'),
        };
    }
}

/**
 * All possible time data units (i.e., milliseconds, seconds, minutes, etc.).
 */
export type TimeDataUnit = 'ms' | 's' | 'm' | 'h' | 'd';

/**
 * A class for representing time data in different units.
 */
class TimeData {
    /**
     * Create a new TimeData object with the given time and unit.
     */
    public static set(time: number, unit: TimeDataUnit): TimeData {
        switch (unit) {
            case 'ms':
                return new TimeData(time);
            case 's':
                return new TimeData(time * 1000);
            case 'm':
                return new TimeData(time * 1000 * 60);
            case 'h':
                return new TimeData(time * 1000 * 60 * 60);
            case 'd':
                return new TimeData(time * 1000 * 60 * 60 * 24);
        }
    }

    /**
     * The value of the time in milliseconds.
     */
    private timeInMs: number;

    constructor(timeInMs: number) {
        this.timeInMs = timeInMs;
    }

    /**
     * Get the value of the time in the given unit.
     */
    public in(unit: TimeDataUnit): number {
        switch (unit) {
            case 'ms':
                return this.timeInMs;
            case 's':
                return this.timeInMs / 1000;
            case 'm':
                return this.timeInMs / 1000 / 60;
            case 'h':
                return this.timeInMs / 1000 / 60 / 60;
            case 'd':
                return this.timeInMs / 1000 / 60 / 60 / 24;
        }
    }
}
