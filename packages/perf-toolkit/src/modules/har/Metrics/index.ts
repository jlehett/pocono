import MetricImplementations from './Implementations';

// Export an array of all metric classes
const metrics = MetricImplementations;
export default metrics;

// Export types for metrics
export type MetricClass = (typeof metrics)[number];
export type Metric = InstanceType<MetricClass>;
export type MetricName = Metric['name'];
