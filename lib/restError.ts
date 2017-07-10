// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import { WebResource } from './webResource';
import * as nodeFetch from 'node-fetch';

export default class RestError extends Error {
  code?: string;
  statusCode?: number;
  request?: WebResource;
  response?: nodeFetch.Response;
  body?: string | object;
  constructor(message: string, code?: string, statusCode?: number, request?: WebResource, response?: nodeFetch.Response, body?: string | object) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.request = request;
    this.response = response;
    this.body = body;
  }
}