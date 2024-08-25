import cloneDeep from 'lodash/cloneDeep';
import { HarEntry } from '../types/har-file-types';
import BaseMetric from './BaseMetric';
import { HarDataFixture } from '../test-utils/fixtures';
import { MetadataName } from '../Metadata';
import { MetricName } from '.';

describe('BaseMetric', () => {
    describe('get', () => {
        class BaseMetricImplementation extends BaseMetric<number> {
            public name = 'TestMetric';

            public analyze(): number {
                return 1;
            }
        }

        it('will call the analyze method and return the result if the result is not in the cache for the given input', () => {
            const metric = new BaseMetricImplementation(
                <ReturnType>(): ReturnType => {
                    return {} as ReturnType;
                },
                <ReturnType>(): ReturnType => {
                    return {} as ReturnType;
                },
            );
            const analyzeSpy = jest.spyOn(metric, 'analyze');

            const result = metric.get('page_1', []);

            expect(analyzeSpy).toHaveBeenCalled();
            expect(result).toBe(1);
        });

        it('will return the cached result instead of calling the analyze method if the result is in the cache for the given input', () => {
            const metric = new BaseMetricImplementation(
                <ReturnType>(): ReturnType => {
                    return {} as ReturnType;
                },
                <ReturnType>(): ReturnType => {
                    return {} as ReturnType;
                },
            );
            const analyzeSpy = jest.spyOn(metric, 'analyze');

            const input: HarEntry[] = [];

            const results = [
                metric.get('page_1', input),
                metric.get('page_1', input),
            ];

            expect(analyzeSpy).toHaveBeenCalledTimes(1);
            expect(results[0]).toBe(1);
            expect(results[1]).toBe(1);
        });

        it('will call the analyze method again if the input is different (by reference, not content)', () => {
            const metric = new BaseMetricImplementation(
                <ReturnType>(): ReturnType => {
                    return {} as ReturnType;
                },
                <ReturnType>(): ReturnType => {
                    return {} as ReturnType;
                },
            );
            const analyzeSpy = jest.spyOn(metric, 'analyze');

            const inputs: HarEntry[][] = [
                [HarDataFixture.mockHarEntry()],
                [HarDataFixture.mockHarEntry()],
            ];
            inputs.push(cloneDeep(inputs[0]));

            let result = metric.get('page_1', inputs[0] as HarEntry[]);
            expect(analyzeSpy).toHaveBeenCalledTimes(1);
            expect(result).toBe(1);

            result = metric.get('page_1', inputs[0] as HarEntry[]);
            expect(analyzeSpy).toHaveBeenCalledTimes(1);
            expect(result).toBe(1);

            result = metric.get('page_1', inputs[1] as HarEntry[]);
            expect(analyzeSpy).toHaveBeenCalledTimes(2);
            expect(result).toBe(1);

            result = metric.get('page_1', inputs[2] as HarEntry[]);
            expect(analyzeSpy).toHaveBeenCalledTimes(3);
            expect(result).toBe(1);
        });
    });

    describe('analyze', () => {
        class BaseMetricImplementation extends BaseMetric<number[]> {
            public name = 'TestMetric';

            public analyze(): number[] {
                return [
                    this.getMetadata('TestUsedMetadata' as MetadataName),
                    this.getMetric('TestUsedMetric' as MetricName, 'page_1'),
                    3,
                ];
            }
        }

        it('should be able to use metadata and other metrics via the `getMetadata` and `getMetric` functions that are passed in the constructor', () => {
            const metric = new BaseMetricImplementation(
                // Get Metadata Mock
                <ReturnType>(): ReturnType => {
                    return 1 as ReturnType;
                },
                // Get Metric Mock
                <ReturnType>(): ReturnType => {
                    return 2 as ReturnType;
                },
            );

            const result = metric.analyze();

            expect(result).toEqual([1, 2, 3]);
        });
    });
});
