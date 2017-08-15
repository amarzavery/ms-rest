// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as uuid from 'uuid';
import * as FormData from 'form-data';
import { WebResource } from '../webResource';
import { Constants } from './constants';
import { RestError } from '../restError';
import { HttpOperationResponse } from '../httpOperationResponse';
const fPF = require('fetch-ponyfill')();
/**
 * Checks if a parsed URL is HTTPS
 *
 * @param {object} urlToCheck The url to check
 * @return {boolean} True if the URL is HTTPS; false otherwise.
 */
export function urlIsHTTPS(urlToCheck) {
    return urlToCheck.protocol.toLowerCase() === Constants.HTTPS;
}
;
/**
 * Checks if a value is null or undefined.
 *
 * @param {object} value The value to check for null or undefined.
 * @return {boolean} True if the value is null or undefined, false otherwise.
 */
// TODO: Audit the usages of this and remove them.
// Read: https://medium.com/@basarat/null-vs-undefined-in-typescript-land-dc0c7a5f240a
// https://github.com/Microsoft/TypeScript/issues/7426
export function objectIsNull(value) {
    return value === null || value === undefined;
}
;
/**
 * Encodes an URI.
 *
 * @param {string} uri The URI to be encoded.
 * @return {string} The encoded URI.
 */
export function encodeUri(uri) {
    return encodeURIComponent(uri)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
;
/**
 * Returns a stripped version of the Http Response which only contains body,
 * headers and the status.
 *
 * @param {nodeFetch.Response} response - The Http Response
 *
 * @return {object} strippedResponse - The stripped version of Http Response.
 */
export function stripResponse(response) {
    const strippedResponse = {};
    strippedResponse.body = response.body;
    strippedResponse.headers = response.headers;
    strippedResponse.status = response.status;
    return strippedResponse;
}
/**
 * Returns a stripped version of the Http Request that does not contain the
 * Authorization header.
 *
 * @param {object} request - The Http Request object
 *
 * @return {object} strippedRequest - The stripped version of Http Request.
 */
export function stripRequest(request) {
    let strippedRequest = new WebResource();
    try {
        strippedRequest = JSON.parse(JSON.stringify(request));
        if (strippedRequest.headers && strippedRequest.headers.Authorization) {
            delete strippedRequest.headers.Authorization;
        }
        else if (strippedRequest.headers && strippedRequest.headers.authorization) {
            delete strippedRequest.headers.authorization;
        }
    }
    catch (err) {
        const errMsg = err.message;
        err.message = `Error - '${errMsg}' occured while creating a stripped version of the request object - '${request}'.`;
        return err;
    }
    return strippedRequest;
}
/**
 * Validates the given uuid as a string
 *
 * @param {string} uuid - The uuid as a string that needs to be validated
 *
 * @return {boolean} result - True if the uuid is valid; false otherwise.
 */
export function isValidUuid(uuid) {
    const validUuidRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', 'ig');
    return validUuidRegex.test(uuid);
}
/**
 * Provides an array of values of an object. For example
 * for a given object { 'a': 'foo', 'b': 'bar' }, the method returns ['foo', 'bar'].
 *
 * @param {object} obj - An object whose properties need to be enumerated so that it's values can be provided as an array
 *
 * @return {array} result - An array of values of the given object.
 */
export function objectValues(obj) {
    const result = [];
    if (obj && obj instanceof Object) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(obj[key]);
            }
        }
    }
    else {
        throw new Error(`The provided object ${JSON.stringify(obj, null, 2)} is not a valid object that can be ` +
            `enumerated to provide its values as an array.`);
    }
    return result;
}
/**
 * Generated UUID
 *
 * @return {string} RFC4122 v4 UUID.
 */
export function generateUuid() {
    return uuid.v4();
}
/*
 * Executes an array of promises sequentially. Inspiration of this method is here:
 * https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html. An awesome blog on promises!
 *
 * @param {Array} promiseFactories An array of promise factories(A function that return a promise)
 *
 * @param {any} [kickstart] Input to the first promise that is used to kickstart the promise chain.
 * If not provided then the promise chain starts with undefined.
 *
 * @return A chain of resolved or rejected promises
 */
export function executePromisesSequentially(promiseFactories, kickstart) {
    let result = Promise.resolve(kickstart);
    promiseFactories.forEach((promiseFactory) => {
        result = result.then(promiseFactory);
    });
    return result;
}
;
/*
 * Merges source object into the target object
 * @param {object} source The object that needs to be merged
 *
 * @param {object} target The object to be merged into
 *
 * @returns {object} target - Returns the merged target object.
 */
export function mergeObjects(source, target) {
    Object.keys(source).forEach((key) => {
        target[key] = source[key];
    });
    return target;
}
/**
 * A wrapper for setTimeout that resolves a promise after t milliseconds.
 * @param {number} t - The number of milliseconds to be delayed.
 * @param {T} value - The value to be resolved with after a timeout of t milliseconds.
 * @returns {Promise<T>} - Resolved promise
 */
export function delay(t, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), t));
}
/**
 * Utility function to create a K:V from a list of strings
 */
export function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null)); // TODO: Audit usage of null.
}
/**
 * Converts a Promise to a callback.
 * @param {Promise<any>} promise - The Promise to be converted to a callback
 * @returns {Function} fn - A function that takes the callback (cb: Function): void
 */
export function promiseToCallback(promise) {
    if (typeof promise.then !== 'function') {
        throw new Error('The provided input is not a Promise.');
    }
    return (cb) => {
        promise.then((data) => {
            process.nextTick(cb, null, data);
        }, (err) => {
            process.nextTick(cb, err);
        });
    };
}
/**
 * Converts a Promise to a service callback.
 * @param {Promise<HttpOperationResponse>} promise - The Promise of HttpOperationResponse to be converted to a service callback
 * @returns {Function} fn - A function that takes the service callback (cb: ServiceCallback<T>): void
 */
export function promiseToServiceCallback(promise) {
    if (typeof promise.then !== 'function') {
        throw new Error('The provided input is not a Promise.');
    }
    return (cb) => {
        promise.then((data) => {
            process.nextTick(cb, null, data.bodyAsJson, data.request, data.response);
        }, (err) => {
            process.nextTick(cb, err);
        });
    };
}
/**
 * Sends the request and returns the received response.
 * @param {WebResource} options - The request to be sent.
 * @returns {Promise<HttpOperationResponse} operationResponse - The response object.
 */
export function dispatchRequest(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options) {
            return Promise.reject(new Error('options (WebResource) cannot be null or undefined and must be of type object.'));
        }
        if (options.formData) {
            const formData = options.formData;
            const requestForm = new FormData();
            const appendFormValue = (key, value) => {
                if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
                    requestForm.append(key, value.value, value.options);
                }
                else {
                    requestForm.append(key, value);
                }
            };
            for (const formKey in formData) {
                if (formData.hasOwnProperty(formKey)) {
                    const formValue = formData[formKey];
                    if (formValue instanceof Array) {
                        for (let j = 0; j < formValue.length; j++) {
                            appendFormValue(formKey, formValue[j]);
                        }
                    }
                    else {
                        appendFormValue(formKey, formValue);
                    }
                }
            }
            options.body = requestForm;
            options.formData = undefined;
            if (options.headers && options.headers['Content-Type'] &&
                options.headers['Content-Type'].indexOf('multipart/form-data') > -1 && typeof requestForm.getBoundary === 'function') {
                options.headers['Content-Type'] = `multipart/form-data; boundary=${requestForm.getBoundary()}`;
            }
        }
        let res;
        try {
            res = yield fPF.fetch(options.url, options);
        }
        catch (err) {
            return Promise.reject(err);
        }
        const operationResponse = new HttpOperationResponse(options, res, res.body);
        if (!options.rawResponse) {
            try {
                operationResponse.bodyAsText = yield res.text();
            }
            catch (err) {
                let msg = `Error "${err}" occured while converting the raw response body into string.`;
                let errCode = err.code || 'RAWTEXT_CONVERSION_ERROR';
                let e = new RestError(msg, errCode, res.status, options, res, res.body);
                return Promise.reject(e);
            }
            try {
                if (operationResponse.bodyAsText) {
                    operationResponse.bodyAsJson = JSON.parse(operationResponse.bodyAsText);
                }
            }
            catch (err) {
                let msg = `Error "${err}" occured while executing JSON.parse on the response body - ${operationResponse.bodyAsText}.`;
                let errCode = err.code || 'JSON_PARSE_ERROR';
                let e = new RestError(msg, errCode, res.status, options, res, operationResponse.bodyAsText);
                return Promise.reject(e);
            }
        }
        return Promise.resolve(operationResponse);
    });
}
//# sourceMappingURL=utils.js.map