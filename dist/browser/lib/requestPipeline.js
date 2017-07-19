// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpOperationResponse } from './httpOperationResponse';
import * as utils from './util/utils';
import * as FormData from 'form-data';
const fPF = require('fetch-ponyfill')();
export class RequestPipeline {
    constructor(filters, requestOptions) {
        this.filters = filters || [];
        this.requestOptions = requestOptions || {};
    }
    addFilter(f) {
        this.filters.push(f);
        return;
    }
    create() {
        const self = this;
        let pipeline = [];
        if (self.filters && self.filters.length) {
            const beforeFilters = [];
            const afterFilters = [];
            for (let i = 0; i < self.filters.length; i++) {
                const filter = self.filters[i];
                if (filter.before && typeof filter.before === 'function') {
                    beforeFilters.push(filter.before.bind(filter));
                }
                if (filter.after && typeof filter.after === 'function') {
                    afterFilters.push(filter.after.bind(filter));
                }
            } // end-of-for-loop
            // add the request sink
            beforeFilters.push(self.requestSink.bind(self));
            pipeline = beforeFilters.concat(afterFilters);
        }
        else {
            pipeline.push(self.requestSink.bind(self));
        }
        let requestFun = (request) => {
            if (!request.headers)
                request.headers = {};
            return utils.executePromisesSequentially(pipeline, request);
        };
        return requestFun;
    }
    requestSink(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.requestOptions.method)
                delete this.requestOptions.method;
            utils.mergeObjects(this.requestOptions, options);
            if (options.formData) {
                const formData = options.formData;
                const requestForm = new FormData();
                const appendFormValue = (key, value) => {
                    if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
                        requestForm.append(key, value.value, value.options);
                    }
                    else {
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
                        }
                        else {
                            appendFormValue(formKey, formValue);
                        }
                    }
                }
                options.body = requestForm;
                options.formData = undefined;
            }
            let res;
            try {
                res = yield fPF.fetch(options.url, options);
            }
            catch (err) {
                throw err;
            }
            const operationResponse = new HttpOperationResponse(options, res, res.body);
            if (!options.rawResponse) {
                try {
                    operationResponse.bodyAsText = yield res.text();
                    if (operationResponse.bodyAsText) {
                        operationResponse.bodyAsJson = JSON.parse(operationResponse.bodyAsText);
                    }
                }
                catch (err) {
                    //do nothing
                }
            }
            return Promise.resolve(operationResponse);
        });
    }
}
//# sourceMappingURL=requestPipeline.js.map