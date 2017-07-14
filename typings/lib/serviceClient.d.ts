import { ServiceClientCredentials } from './credentials/serviceClientCredentials';
import { BaseFilter } from './filters/baseFilter';
import { WebResource, RequestPrepareOptions } from './webResource';
import { HttpOperationResponse } from './httpOperationResponse';
/**
 * Options to be provided while creating the client.
 * @property {RequestInit} [requestOptions] The request options. Detailed info can be found here https://github.github.io/fetch/#Request
 * @property {Array<BaseFilter>} [filters] An array of filters/interceptors that will be processed in the request pipeline (before and after) sending the request on the wire.
 * @property {bool} [options.noRetryPolicy] - If set to true, turn off default retry policy
 */
export interface ServiceClientOptions {
    requestOptions?: RequestInit;
    filters?: BaseFilter[];
    noRetryPolicy?: boolean;
}
/**
 * @class
 * Initializes a new instance of the ServiceClient.
 * @constructor
 * @param {ServiceClientCredentials} [credentials]    - BasicAuthenticationCredentials or
 * TokenCredentials object used for authentication.
 *
 * @param {ServiceClientOptions} [options] The service client options that govern the behavior of the client.
 */
export declare class ServiceClient {
    userAgentInfo: {
        value: Array<string>;
    };
    pipeline: Function;
    constructor(credentials?: ServiceClientCredentials, options?: ServiceClientOptions);
    /**
     * Adds custom information to user agent header
     * @param {any} additionalUserAgentInfo - information to be added to user agent header, as string.
     */
    addUserAgentInfo(additionalUserAgentInfo: string): void;
    sendRequest(options: RequestPrepareOptions | WebResource): Promise<HttpOperationResponse>;
}
