// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import BaseFilter from './baseFilter';
import WebResource from '../webResource';
import HttpOperationResponse from '../httpOperationResponse';

class LogFilter extends BaseFilter {

  logger?: any;

  constructor(logger: any = console.log) {
    super();
    this.logger = logger;
  }

  before(request: WebResource): Promise<WebResource> {
    let self = this;
    self.logger(`>> Request: ${JSON.stringify(request, null, 2)}`);
    return Promise.resolve(request);
  }

  after(operationResponse: HttpOperationResponse): Promise<HttpOperationResponse> {
    let self = this;
    self.logger(`>> Response status code: ${operationResponse.response.status}`);
    self.logger(`>> Body: ${JSON.stringify(operationResponse.body)}`);
    return Promise.resolve(operationResponse);
  }
}

export default LogFilter;