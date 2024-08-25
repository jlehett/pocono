/**
 * A cookie in a HAR file's logs.
 */
export type Cookie = {
    name: string;
    value: string;
    path: string;
    domain: string;
    expires: string;
    httpOnly: boolean;
    secure: boolean;
};

/**
 * An object with name and value properties.
 */
export type NamedValueObject = {
    name: string;
    value: string;
};

/**
 * The request data for an entry in a HAR file's logs.
 */
export type HarEntryRequest = {
    method: string;
    url: string;
    httpVersion: string;
    headers: NamedValueObject[];
    queryString: NamedValueObject[];
    cookies: Cookie[];
    headersSize: number;
    bodySize: number;
};

/**
 * The response content data for an entry in a HAR file's logs.
 */
export type HarEntryResponseContent = {
    size: number;
    mimeType: string;
    text: string;
};

/**
 * The response data for an entry in a HAR file's logs.
 */
export type HarEntryResponse = {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: NamedValueObject[];
    cookies: Cookie[];
    content: HarEntryResponseContent;
    redirectURL: string;
    headersSize: number;
    bodySize: number;
    _transferSize: number;
    _error: string | null;
    _fetchedViaServiceWorker: boolean;
};

/**
 * The timings data for an entry in a HAR file's logs.
 */
export type HarEntryTimings = {
    blocked: number;
    dns: number;
    ssl: number;
    connect: number;
    send: number;
    wait: number;
    receive: number;
    _blocked_queueing: number;
    _workerStart: number;
    _workerReady: number;
    _workerFetchStart: number;
    _workerRespondWithSettled: number;
};

/**
 * The initiator data for an entry in a HAR file's logs.
 */
export type HarEntryInitiator = {
    type: string;
    url: string;
    lineNumber: number;
};

/**
 * An entry in a HAR file's logs.
 */
export type HarEntry = {
    _initiator: HarEntryInitiator;
    _priority: string;
    _resourceType: string;
    cache: Object;
    connection: string;
    pageref: string;
    request: HarEntryRequest;
    response: HarEntryResponse;
    serverIPAddress: string;
    startedDateTime: string;
    time: number;
    timings: HarEntryTimings;
};

/**
 * The creator of a HAR file.
 */
export type HarCreator = {
    name: string;
    version: string;
};

/**
 * The log of a HAR file.
 */
export type HarLog = {
    version: string;
    creator: HarCreator;
    pages: HarPage[];
    entries: HarEntry[];
};

/**
 * The HAR format is a JSON-formatted archive file format for logging of a web browser's interaction with a site.
 */
export type HarData = {
    log: HarLog;
};

/**
 * The timings data for a page in a HAR file's logs.
 */
export type HarPageTimings = {
    onContentLoad: number;
    onLoad: number;
};

/**
 * A page in a HAR file's logs.
 */
export type HarPage = {
    startedDateTime: string;
    id: string;
    title: string;
    pageTimings: HarPageTimings;
};
