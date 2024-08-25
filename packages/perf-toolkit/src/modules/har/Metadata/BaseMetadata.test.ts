import BaseMetadata from './BaseMetadata';

describe('BaseMetadata', () => {
    class BaseMetadataImplementation extends BaseMetadata<number> {
        public name = 'TestMetadata';

        private retVal: number;

        constructor(retVal: number) {
            super();
            this.retVal = retVal;
        }

        public compute(): number {
            return this.retVal;
        }
    }

    describe('get', () => {
        it('will call the compute method and return the result if the result has not been cached', () => {
            const metadata = new BaseMetadataImplementation(1);
            const computeSpy = jest.spyOn(metadata, 'compute');

            const result = metadata.get({} as any);

            expect(computeSpy).toHaveBeenCalled();
            expect(result).toBe(1);
        });

        it('will return the cached result instead of calling the compute method if the result is in the cache', () => {
            const metadata = new BaseMetadataImplementation(1);
            const computeSpy = jest.spyOn(metadata, 'compute');

            const input = {} as any;

            const results = [metadata.get(input), metadata.get(input)];

            expect(computeSpy).toHaveBeenCalledTimes(1);
            expect(results[0]).toBe(1);
            expect(results[1]).toBe(1);
        });
    });
});
