// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

import * as stream from 'stream';
import * as nodeFetch from 'node-fetch';
import { WebResource } from './webResource';

/**
 * Wrapper object for http request and response. Deserialized object is stored in
 * the `body` property.
 * @class
 * Initializes a new instance of the HttpOperationResponse class.
 * @constructor
 */
export default class HttpOperationResponse {
  /**
   * The raw request
   */
  request: WebResource;
  /**
   * The raw response
   */
  response: nodeFetch.Response;
  /**
   * The response body as text (string format) or a stream
   */
  body: string | stream;
  constructor(request: WebResource, response: nodeFetch.Response) {
    /**
     * Reference to the original request object.
     * [WebResource] object.
     * @type {object}
     */
    this.request = request;

    /**
     * Reference to the original response object.
     * [ServerResponse] object.
     * @type {object}
     */
    this.response = response;

    /**
     * The response object.
     * @type {object}
     */
    this.body = undefined;
  }
}
