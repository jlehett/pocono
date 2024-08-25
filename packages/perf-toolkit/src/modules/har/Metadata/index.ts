import MetadataImplementations from './Implementations';

// Export an array of all metadata classes
const metadata = MetadataImplementations;
export default metadata;

// Export types for metadata
export type MetadataClass = (typeof metadata)[number];
export type Metadata = InstanceType<MetadataClass>;
export type MetadataName = Metadata['name'];
