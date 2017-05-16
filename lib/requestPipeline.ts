// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

"use strict";

import { WebResource } from "./webResource";
import HttpOperationResponse from "./httpOperationResponse";
import BaseFilter from "./filters/baseFilter";
import * as utils from "./util/utils";
import * as nodeFetch from "node-fetch";
const fetchCookie = require("fetch-cookie");
import * as FormData from "form-data";
const fetch = fetchCookie(nodeFetch);

Object.assign(nodeFetch.Response.prototype, {
  statusCode: nodeFetch.Response.prototype.status
});

export default class RequestPipeline {
  filters?: BaseFilter[];
  requestOptions?: nodeFetch.RequestInit;

  constructor(filters?: BaseFilter[], requestOptions?: nodeFetch.RequestInit) {
    this.filters = filters || [];
    this.requestOptions = requestOptions;
  }

  addFilter(f: BaseFilter): void {
    this.filters.push(f);
    return;
  }

  create(): Function {
    const self = this;
    let pipeline: Array<Function> = [];
    if (self.filters && self.filters.length) {
      const beforeFilters: Array<Function> = [];
      const afterFilters: Array<Function> = [];
      for (let i = 0; i < self.filters.length; i++) {
        const filter = self.filters[i];
        if (filter.before && typeof filter.before === "function") {
          beforeFilters.push(filter.before.bind(filter));
        }
        if (filter.after && typeof filter.after === "function") {
          afterFilters.push(filter.after.bind(filter));
        }
      }// end-of-for-loop
      // add the request sink
      beforeFilters.push(self.requestSink.bind(self));
      pipeline = beforeFilters.concat(afterFilters);
    } else {
      pipeline.push(self.requestSink.bind(self));
    }
    return (request: WebResource): Promise<HttpOperationResponse> => {
      if (!request.headers) request.headers = {};
      return utils.executePromisesSequentially(pipeline, request);
    };
  }

  async requestSink(options: WebResource): Promise<HttpOperationResponse> {
    if (this.requestOptions.method) delete this.requestOptions.method;
    utils.mergeObjects(this.requestOptions, options);
    if (options.formData) {
      const formData: any = options.formData;
      const requestForm = new FormData();
      const appendFormValue = (key: string, value: any) => {
        if (value && value.hasOwnProperty("value") && value.hasOwnProperty("options")) {
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
    let res: nodeFetch.Response;
    try {
      res = await fetch(options.url, options);
    } catch (err) {
      throw err;
    }
    const operationResponse = new HttpOperationResponse(options, res);
    if (options.rawResponse) {
      operationResponse.body = res.body;
    } else {
      operationResponse.body = await res.text();
    }
    return operationResponse;
  }
}
