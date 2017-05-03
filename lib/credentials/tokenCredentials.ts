// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import Constants from '../util/constants';
import WebResource from '../webResource';
import SereviceClientCredentials from './serviceClientCredentials';

const HeaderConstants = Constants.HeaderConstants;
const DEFAULT_AUTHORIZATION_SCHEME = 'Basic';

/**
 * Creates a new TokenCredentials object.
 *
 * @constructor
 * @param {string} token               The token.
 * @param {string} authorizationScheme The authorization scheme.
 */
export default class TokenCredentials implements SereviceClientCredentials {
  token: string;
  authorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME;

  constructor(token: string, authorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME) {
    this.token = token;
    this.authorizationScheme = authorizationScheme;
  }

  /**
   * Signs a request with the Authentication header.
   *
   * @param {WebResource} The WebResource to be signed.
   * @return {Promise<null>}
   */
  signRequest(webResource: WebResource) {
    webResource.headers[HeaderConstants.AUTHORIZATION] = `${this.authorizationScheme} ${this.token}`;
    return Promise.resolve();
  }
}