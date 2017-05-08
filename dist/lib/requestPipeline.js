// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var httpOperationResponse_1 = require("./httpOperationResponse");
var utils = require("./util/utils");
var nodeFetch = require("node-fetch");
var fetchCookie = require('fetch-cookie');
var FormData = require("form-data");
var fetch = fetchCookie(nodeFetch);
Object.assign(nodeFetch.Response.prototype, {
    statusCode: nodeFetch.Response.prototype.status
});
var RequestPipeline = (function () {
    function RequestPipeline(filters, requestOptions) {
        this.filters = filters || [];
        this.requestOptions = requestOptions;
    }
    RequestPipeline.prototype.addFilter = function (f) {
        this.filters.push(f);
        return;
    };
    RequestPipeline.prototype.create = function () {
        var self = this;
        var pipeline = [];
        if (self.filters && self.filters.length) {
            var beforeFilters = [];
            var afterFilters = [];
            for (var i = 0; i < self.filters.length; i++) {
                var filter = self.filters[i];
                if (filter.before && typeof filter.before === 'function') {
                    beforeFilters.push(filter.before.bind(filter));
                }
                if (filter.after && typeof filter.after === 'function') {
                    afterFilters.push(filter.after.bind(filter));
                }
            } //end-of-for-loop
            //add the request sink
            beforeFilters.push(self.requestSink.bind(self));
            pipeline = beforeFilters.concat(afterFilters);
        }
        else {
            pipeline.push(self.requestSink.bind(self));
        }
        return function (request) {
            if (!request.headers)
                request.headers = {};
            return utils.executePromisesSequentially(pipeline, request);
        };
    };
    RequestPipeline.prototype.requestSink = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, requestForm_1, appendFormValue, formKey, formValue, j, res, err_1, operationResponse, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.requestOptions.method)
                            delete this.requestOptions.method;
                        utils.mergeObjects(this.requestOptions, options);
                        if (options.formData) {
                            formData = options.formData;
                            requestForm_1 = new FormData();
                            appendFormValue = function (key, value) {
                                if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
                                    requestForm_1.append(key, value.value, value.options);
                                }
                                else {
                                    requestForm_1.append(key, value);
                                }
                            };
                            for (formKey in formData) {
                                if (formData.hasOwnProperty(formKey)) {
                                    formValue = formData[formKey];
                                    if (formValue instanceof Array) {
                                        for (j = 0; j < formValue.length; j++) {
                                            appendFormValue(formKey, formValue[j]);
                                        }
                                    }
                                    else {
                                        appendFormValue(formKey, formValue);
                                    }
                                }
                            }
                            options.body = requestForm_1;
                            options.formData = null;
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(options.url, options)];
                    case 2:
                        res = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        throw err_1;
                    case 4:
                        operationResponse = new httpOperationResponse_1["default"](options, res);
                        if (!options.rawResponse) return [3 /*break*/, 5];
                        operationResponse.body = res.body;
                        return [3 /*break*/, 7];
                    case 5:
                        _a = operationResponse;
                        return [4 /*yield*/, res.text()];
                    case 6:
                        _a.body = _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, operationResponse];
                }
            });
        });
    };
    return RequestPipeline;
}());
exports["default"] = RequestPipeline;
