import { WebResource } from './webResource';
/**
 * Wrapper object for http request and response. Deserialized object is stored in
 * the `body` property.
 * @class
 * Initializes a new instance of the HttpOperationResponse class.
 * @constructor
 */
export declare class HttpOperationResponse {
    /**
     * The raw request
     */
    request: WebResource;
    /**
     * The raw response
     */
    response: Response;
    /**
     * The response body as text (string format) or a stream
     */
    body: string | ReadableStream | null;
    constructor(request: WebResource, response: Response);
}
