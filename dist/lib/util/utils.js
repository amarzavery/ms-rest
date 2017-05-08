// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';
exports.__esModule = true;
var webResource_1 = require("../webResource");
var constants_1 = require("./constants");
var uuid = require("uuid");
/**
* Checks if a parsed URL is HTTPS
*
* @param {object} urlToCheck The url to check
* @return {boolean} True if the URL is HTTPS; false otherwise.
*/
function urlIsHTTPS(urlToCheck) {
    return urlToCheck.protocol.toLowerCase() === constants_1["default"].HTTPS;
}
exports.urlIsHTTPS = urlIsHTTPS;
;
/**
* Checks if a value is null or undefined.
*
* @param {object} value The value to check for null or undefined.
* @return {boolean} True if the value is null or undefined, false otherwise.
*/
function objectIsNull(value) {
    return value === null || value === undefined;
}
exports.objectIsNull = objectIsNull;
;
/**
* Encodes an URI.
*
* @param {string} uri The URI to be encoded.
* @return {string} The encoded URI.
*/
function encodeUri(uri) {
    return encodeURIComponent(uri)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
exports.encodeUri = encodeUri;
;
/**
 * Returns a stripped version of the Http Response which only contains body,
 * headers and the statusCode.
 *
 * @param {stream} response - The Http Response
 *
 * @return {object} strippedResponse - The stripped version of Http Response.
 */
function stripResponse(response) {
    var strippedResponse = {};
    strippedResponse.body = response.body;
    strippedResponse.headers = response.headers;
    strippedResponse.statusCode = response.statusCode;
    return strippedResponse;
}
exports.stripResponse = stripResponse;
/**
 * Returns a stripped version of the Http Request that does not contain the
 * Authorization header.
 *
 * @param {object} request - The Http Request object
 *
 * @return {object} strippedRequest - The stripped version of Http Request.
 */
function stripRequest(request) {
    var strippedRequest = new webResource_1.WebResource();
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
        var errMsg = err.message;
        err.message = "Error - \"" + errMsg + "\" occured while creating a stripped version of the request object - \"" + request + "\".";
        return err;
    }
    return strippedRequest;
}
exports.stripRequest = stripRequest;
/**
 * Validates the given uuid as a string
 *
 * @param {string} uuid - The uuid as a string that needs to be validated
 *
 * @return {boolean} result - True if the uuid is valid; false otherwise.
 */
function isValidUuid(uuid) {
    var validUuidRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', 'ig');
    return validUuidRegex.test(uuid);
}
exports.isValidUuid = isValidUuid;
/**
 * Provides an array of values of an object. For example
 * for a given object { 'a': 'foo', 'b': 'bar' }, the method returns ['foo', 'bar'].
 *
 * @param {object} obj - An object whose properties need to be enumerated so that it's values can be provided as an array
 *
 * @return {array} result - An array of values of the given object.
 */
function objectValues(obj) {
    var result = [];
    if (obj && obj instanceof Object) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(obj[key]);
            }
        }
    }
    else {
        throw new Error("The provided object " + JSON.stringify(obj, null, 2) + " is not a valid object that can be " +
            "enumerated to provide its values as an array.");
    }
    return result;
}
exports.objectValues = objectValues;
/**
* Generated UUID
*
* @return {string} RFC4122 v4 UUID.
*/
function generateUuid() {
    return uuid.v4();
}
exports.generateUuid = generateUuid;
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
function executePromisesSequentially(promiseFactories, kickstart) {
    var result = Promise.resolve(kickstart);
    promiseFactories.forEach(function (promiseFactory) {
        result = result.then(promiseFactory);
    });
    return result;
}
exports.executePromisesSequentially = executePromisesSequentially;
;
/*
 * Merges source object into the target object
 * @param {object} source The object that needs to be merged
 *
 * @param {object} target The object to be merged into
 *
 * @returns {object} target - Returns the merged target object.
 */
function mergeObjects(source, target) {
    Object.keys(source).forEach(function (key) {
        target[key] = source[key];
    });
    return target;
}
exports.mergeObjects = mergeObjects;
/**
 * A wrapper for setTimeout that resolves a promise after t milliseconds.
 * @param {number} t - The number of milliseconds to be delayed.
 * @returns {Promise<T>} - Resolved promise
 */
function delay(t, value) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(value); }, t); });
}
exports.delay = delay;
/**
 * Utility function to create a K:V from a list of strings
 */
function strEnum(o) {
    return o.reduce(function (res, key) {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.strEnum = strEnum;
