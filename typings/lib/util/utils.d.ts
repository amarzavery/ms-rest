import { WebResource } from '../webResource';
/**
 * Checks if a parsed URL is HTTPS
 *
 * @param {object} urlToCheck The url to check
 * @return {boolean} True if the URL is HTTPS; false otherwise.
 */
export declare function urlIsHTTPS(urlToCheck: {
    protocol: string;
}): boolean;
/**
 * Checks if a value is null or undefined.
 *
 * @param {object} value The value to check for null or undefined.
 * @return {boolean} True if the value is null or undefined, false otherwise.
 */
export declare function objectIsNull(value: any): boolean;
/**
 * Encodes an URI.
 *
 * @param {string} uri The URI to be encoded.
 * @return {string} The encoded URI.
 */
export declare function encodeUri(uri: string): string;
/**
 * Returns a stripped version of the Http Response which only contains body,
 * headers and the status.
 *
 * @param {nodeFetch.Response} response - The Http Response
 *
 * @return {object} strippedResponse - The stripped version of Http Response.
 */
export declare function stripResponse(response: Response): any;
/**
 * Returns a stripped version of the Http Request that does not contain the
 * Authorization header.
 *
 * @param {object} request - The Http Request object
 *
 * @return {object} strippedRequest - The stripped version of Http Request.
 */
export declare function stripRequest(request: WebResource): WebResource;
/**
 * Validates the given uuid as a string
 *
 * @param {string} uuid - The uuid as a string that needs to be validated
 *
 * @return {boolean} result - True if the uuid is valid; false otherwise.
 */
export declare function isValidUuid(uuid: string): boolean;
/**
 * Provides an array of values of an object. For example
 * for a given object { 'a': 'foo', 'b': 'bar' }, the method returns ['foo', 'bar'].
 *
 * @param {object} obj - An object whose properties need to be enumerated so that it's values can be provided as an array
 *
 * @return {array} result - An array of values of the given object.
 */
export declare function objectValues(obj: {
    [key: string]: any;
}): any[];
/**
 * Generated UUID
 *
 * @return {string} RFC4122 v4 UUID.
 */
export declare function generateUuid(): string;
export declare function executePromisesSequentially(promiseFactories: Array<any>, kickstart: any): Promise<any>;
export declare function mergeObjects(source: {
    [key: string]: any;
}, target: {
    [key: string]: any;
}): {
    [key: string]: any;
};
/**
 * A wrapper for setTimeout that resolves a promise after t milliseconds.
 * @param {number} t - The number of milliseconds to be delayed.
 * @param {T} value - The value to be resolved with after a timeout of t milliseconds.
 * @returns {Promise<T>} - Resolved promise
 */
export declare function delay<T>(t: number, value?: T): Promise<T>;
/**
 * Utility function to create a K:V from a list of strings
 */
export declare function strEnum<T extends string>(o: Array<T>): {
    [K in T]: K;
};
