// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { WebResource } from './webResource';
import { HttpOperationResponse } from './httpOperationResponse';
import { RestError } from './restError';
import { BaseFilter } from './filters/baseFilter';
import * as utils from './util/utils';
import * as FormData from 'form-data';
const fPF = require('fetch-ponyfill')();

export interface RequestFunction {
  (webResource: WebResource): Promise<HttpOperationResponse>;
}
export class RequestPipeline {
  filters: BaseFilter[];
  requestOptions: RequestInit;

  constructor(filters?: BaseFilter[], requestOptions?: RequestInit) {
    this.filters = filters || [];
    this.requestOptions = requestOptions || {};
  }

  addFilter(f: BaseFilter): void {
    this.filters.push(f);
    return;
  }

  create(): RequestFunction {
    const self = this;
    let pipeline: Array<Function> = [];
    if (self.filters && self.filters.length) {
      const beforeFilters: Array<Function> = [];
      const afterFilters: Array<Function> = [];
      for (let i = 0; i < self.filters.length; i++) {
        const filter = self.filters[i];
        if (filter.before && typeof filter.before === 'function') {
          beforeFilters.push(filter.before.bind(filter));
        }
        if (filter.after && typeof filter.after === 'function') {
          afterFilters.push(filter.after.bind(filter));
        }
      }// end-of-for-loop
      // add the request sink
      beforeFilters.push(self.requestSink.bind(self));
      pipeline = beforeFilters.concat(afterFilters);
    } else {
      pipeline.push(self.requestSink.bind(self));
    }
    let requestFun: RequestFunction = (request: WebResource): Promise<HttpOperationResponse> => {
      if (!request.headers) request.headers = {};
      return utils.executePromisesSequentially(pipeline, request);
    }
    return requestFun;
  }

  async requestSink(options: WebResource): Promise<HttpOperationResponse> {
    if (this.requestOptions.method) delete this.requestOptions.method;
    utils.mergeObjects(this.requestOptions, options);
    if (options.formData) {
      const formData: any = options.formData;
      const requestForm = new FormData();
      const appendFormValue = (key: string, value: any) => {
        if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
          requestForm.append(key, value.value, value.options);
        } else {
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
          } else {
            appendFormValue(formKey, formValue);
          }
        }
      }

      options.body = requestForm;
      options.formData = undefined;
    }
    let res: Response;
    try {
      res = await fPF.fetch(options.url, options);
    } catch (err) {
      throw err;
    }
    const operationResponse = new HttpOperationResponse(options, res, res.body);
    if (!options.rawResponse) {
      try {
        operationResponse.bodyAsText = await res.text();
      } catch (err) {
        let msg = `Error "${err}" occured while converting the raw response body into string.`;
        let errCode = err.code || 'RAWTEXT_CONVERSION_ERROR';
        let e = new RestError(msg, errCode, res.status, options, res, res.body);
        return Promise.reject(e);
      }
      try {
        if (operationResponse.bodyAsText) {
          operationResponse.bodyAsJson = JSON.parse(operationResponse.bodyAsText);
        }
      } catch (err) {
        let msg: string = `Error "${err}" occured while executing JSON.parse on the response body - ${operationResponse.bodyAsText}.`;
        let errCode = err.code || 'JSON_PARSE_ERROR';
        let e = new RestError(msg, errCode, res.status, options, res, operationResponse.bodyAsText);
        return Promise.reject(e);
      }
    }
    return Promise.resolve(operationResponse);
  }
}
