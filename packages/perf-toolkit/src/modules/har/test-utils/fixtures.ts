import { faker } from '@faker-js/faker';
import {
    HarData,
    HarEntry,
    HarEntryInitiator,
    HarEntryRequest,
    HarEntryResponse,
    HarEntryResponseContent,
    HarEntryTimings,
    HarLog,
    HarPage,
    HarPageTimings,
} from '../types/har-file-types';

export class HarDataFixture {
    public static mockInitiator(
        overrides: Partial<HarEntryInitiator> = {},
    ): HarEntryInitiator {
        return {
            type: overrides.type || 'parser',
            url: overrides.url || faker.internet.url(),
            lineNumber:
                overrides.lineNumber || faker.number.int({ min: 0, max: 1000 }),
        };
    }

    public static mockHarEntryRequest(
        overrides: Partial<HarEntryRequest> = {},
    ): HarEntryRequest {
        return {
            method:
                overrides.method ||
                faker.helpers.arrayElement([
                    'GET',
                    'POST',
                    'PUT',
                    'DELETE',
                    'PATCH',
                ]),
            url: overrides.url || faker.internet.url(),
            httpVersion: overrides.httpVersion || 'HTTP/1.1',
            headers: overrides.headers || [],
            queryString: overrides.queryString || [],
            cookies: overrides.cookies || [],
            headersSize:
                overrides.headersSize ||
                faker.number.int({ min: 0, max: 1000 }),
            bodySize:
                overrides.bodySize || faker.number.int({ min: 0, max: 1000 }),
        };
    }

    public static mockHarEntryResponseContent(
        overrides: Partial<HarEntryResponseContent> = {},
    ): HarEntryResponseContent {
        return {
            size: overrides.size || faker.number.int({ min: 0, max: 1000 }),
            mimeType: overrides.mimeType || faker.system.mimeType(),
            text: overrides.text || faker.lorem.paragraph(),
        };
    }

    public static mockHarEntryResponse(
        overrides: Partial<HarEntryResponse> = {},
    ): HarEntryResponse {
        return {
            status:
                overrides.status || faker.number.int({ min: 100, max: 599 }),
            statusText: overrides.statusText || faker.lorem.words(),
            httpVersion: overrides.httpVersion || 'HTTP/1.1',
            headers: overrides.headers || [],
            cookies: overrides.cookies || [],
            content:
                overrides.content ||
                HarDataFixture.mockHarEntryResponseContent(),
            redirectURL: overrides.redirectURL || faker.internet.url(),
            headersSize:
                overrides.headersSize ||
                faker.number.int({ min: 0, max: 1000 }),
            bodySize:
                overrides.bodySize || faker.number.int({ min: 0, max: 1000 }),
            _transferSize:
                overrides._transferSize ||
                faker.number.int({ min: 0, max: 1000 }),
            _error: overrides._error || faker.lorem.words(),
            _fetchedViaServiceWorker:
                overrides._fetchedViaServiceWorker || faker.datatype.boolean(),
        };
    }

    public static mockHarEntryTimings(
        overrides: Partial<HarEntryTimings> = {},
    ): HarEntryTimings {
        return {
            blocked:
                overrides.blocked || faker.number.int({ min: 0, max: 1000 }),
            dns: overrides.dns || faker.number.int({ min: 0, max: 1000 }),
            ssl: overrides.ssl || faker.number.int({ min: 0, max: 1000 }),
            connect:
                overrides.connect || faker.number.int({ min: 0, max: 1000 }),
            send: overrides.send || faker.number.int({ min: 0, max: 1000 }),
            wait: overrides.wait || faker.number.int({ min: 0, max: 1000 }),
            receive:
                overrides.receive || faker.number.int({ min: 0, max: 1000 }),
            _blocked_queueing:
                overrides._blocked_queueing ||
                faker.number.int({ min: 0, max: 1000 }),
            _workerStart:
                overrides._workerStart ||
                faker.number.int({ min: 0, max: 1000 }),
            _workerReady:
                overrides._workerReady ||
                faker.number.int({ min: 0, max: 1000 }),
            _workerFetchStart:
                overrides._workerFetchStart ||
                faker.number.int({ min: 0, max: 1000 }),
            _workerRespondWithSettled:
                overrides._workerRespondWithSettled ||
                faker.number.int({ min: 0, max: 1000 }),
        };
    }

    public static mockHarEntry(overrides: Partial<HarEntry> = {}): HarEntry {
        return {
            _initiator: overrides._initiator || HarDataFixture.mockInitiator(),
            _priority:
                overrides._priority ||
                faker.helpers.arrayElement([
                    'VeryHigh',
                    'High',
                    'Medium',
                    'Low',
                    'VeryLow',
                ]),
            _resourceType:
                overrides._resourceType ||
                faker.helpers.arrayElement([
                    'document',
                    'script',
                    'stylesheet',
                    'image',
                    'media',
                    'font',
                    'other',
                ]),
            cache: overrides.cache || {},
            connection: overrides.connection || faker.internet.ip(),
            pageref: overrides.pageref || faker.string.uuid(),
            request: overrides.request || HarDataFixture.mockHarEntryRequest(),
            response:
                overrides.response || HarDataFixture.mockHarEntryResponse(),
            serverIPAddress: overrides.serverIPAddress || faker.internet.ip(),
            startedDateTime:
                overrides.startedDateTime || faker.date.recent().toISOString(),
            time: overrides.time || faker.number.int({ min: 0, max: 1000 }),
            timings: overrides.timings || HarDataFixture.mockHarEntryTimings(),
        };
    }

    public static mockHarPageTimings(
        overrides: Partial<HarPageTimings> = {},
    ): HarPageTimings {
        return {
            onContentLoad:
                overrides.onContentLoad ||
                faker.number.int({ min: 0, max: 1000 }),
            onLoad: overrides.onLoad || faker.number.int({ min: 0, max: 1000 }),
        };
    }

    public static mockHarPage(overrides: Partial<HarPage> = {}): HarPage {
        return {
            startedDateTime:
                overrides.startedDateTime || faker.date.recent().toISOString(),
            id: overrides.id || faker.string.uuid(),
            title: overrides.title || faker.lorem.words(),
            pageTimings:
                overrides.pageTimings || HarDataFixture.mockHarPageTimings(),
        };
    }

    public static mockHarLog(overrides: Partial<HarLog> = {}): HarLog {
        return {
            version: overrides.version || '1.2',
            creator: overrides.creator || {
                name: 'Test',
                version: '1.0',
            },
            pages: overrides.pages || [],
            entries: overrides.entries || [],
        };
    }

    public static mockHarData(overrides: Partial<HarData> = {}): HarData {
        return {
            log: overrides.log || HarDataFixture.mockHarLog(),
        };
    }
}
