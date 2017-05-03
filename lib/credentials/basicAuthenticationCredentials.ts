// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import Constants from '../util/constants';
import WebResource from '../webResource';
import SereviceClientCredentials from './serviceClientCredentials';

var Buffer = require('buffer/');
const HeaderConstants = Constants.HeaderConstants;
const DEFAULT_AUTHORIZATION_SCHEME = 'Basic';

/**
 * Creates a new BasicAuthenticationCredentials object.
 *
 * @constructor
 * @param {string} userName                 User name.
 * @param {string} password                 Password.
 * @param {string} [authorizationScheme]    The authorization scheme.
 */
export default class BasicAuthenticationCredentials implements SereviceClientCredentials {
  userName: string;
  password: string;
  authorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME;
  constructor(userName: string, password: string, authorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME) {
    this.userName = userName;
    this.password = password;
    this.authorizationScheme = authorizationScheme;
  }

  /**
   * Signs a request with the Authentication header.
   *
   * @param {WebResource} The WebResource to be signed.
   * @return {undefined}
   */
  signRequest(webResource: WebResource) {
    let credentials = `${this.userName}:${this.password}`;
    let encodedCredentials = `${this.authorizationScheme} ${new Buffer(credentials).toString('base64')}`;
    webResource.headers[HeaderConstants.AUTHORIZATION] = encodedCredentials;
    return Promise.resolve();
  }
}