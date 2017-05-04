// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

/**
 * Creates a new WebResource object.
 *
 * This class provides an abstraction over a REST call by being library / implementation agnostic and wrapping the necessary
 * properties to initiate a request.
 *
 * @constructor
 */
export default class WebResource {
  url?: string;
  method?: string;
  body?: any;
  headers?: { [key: string]: any; } = {};
  rawResponse?: boolean = false;
  formData?: any;

  constructor(url?: string, method?: string, body?: any, headers: { [key: string]: any; } = {}, rawResponse: boolean = false) {
    this.rawResponse = rawResponse;
    this.url = url;
    this.method = method;
    this.headers = headers;
    this.body = body;
    this.formData = null;
  }
}