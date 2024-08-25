import { HarData } from '../types/har-file-types';

/**
 * A base class for creating metadata for a HAR file.
 */
export default abstract class BaseMetadata<ReturnType> {
    /**
     * The name of the metadata.
     */
    public abstract readonly name: string;

    /**
     * A cache for storing the computed value of the metadata for the HAR file.
     */
    protected cachedValue: ReturnType | null = null;

    /**
     * Compute the metadata for the given HAR file.
     */
    public abstract compute(harFile: HarData): ReturnType;

    /**
     * Get the computed value of the metadata for the HAR file.
     * If the value has already been computed, it will be returned from the cache.
     */
    public get(harFile: HarData): ReturnType {
        if (!this.cachedValue) {
            this.cachedValue = this.compute(harFile);
        }

        return this.cachedValue;
    }
}
