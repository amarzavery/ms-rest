// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';
exports.__esModule = true;
var constants_1 = require("../util/constants");
var Buffer = require('buffer/').Buffer;
var HeaderConstants = constants_1["default"].HeaderConstants;
var DEFAULT_AUTHORIZATION_SCHEME = 'Basic';
/**
 * Creates a new BasicAuthenticationCredentials object.
 *
 * @constructor
 * @param {string} userName                 User name.
 * @param {string} password                 Password.
 * @param {string} [authorizationScheme]    The authorization scheme.
 */
var BasicAuthenticationCredentials = (function () {
    function BasicAuthenticationCredentials(userName, password, authorizationScheme) {
        if (authorizationScheme === void 0) { authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME; }
        this.authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME;
        if (userName === null || userName === undefined || typeof userName.valueOf() !== 'string') {
            throw new Error('userName cannot be null or undefined and must be of type string.');
        }
        if (password === null || password === undefined || typeof password.valueOf() !== 'string') {
            throw new Error('password cannot be null or undefined and must be of type string.');
        }
        this.userName = userName;
        this.password = password;
        this.authorizationScheme = authorizationScheme;
    }
    /**
     * Signs a request with the Authentication header.
     *
     * @param {WebResource} The WebResource to be signed.
     * @returns {Promise<WebResource>} - The signed request object.
     */
    BasicAuthenticationCredentials.prototype.signRequest = function (webResource) {
        var credentials = this.userName + ":" + this.password;
        var encodedCredentials = this.authorizationScheme + " " + Buffer.from(credentials).toString('base64');
        webResource.headers[HeaderConstants.AUTHORIZATION] = encodedCredentials;
        return Promise.resolve(webResource);
    };
    return BasicAuthenticationCredentials;
}());
exports["default"] = BasicAuthenticationCredentials;
