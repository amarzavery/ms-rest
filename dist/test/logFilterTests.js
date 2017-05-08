"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
exports.__esModule = true;
var assert = require("assert");
var nodeFetch = require("node-fetch");
var webResource_1 = require("../lib/webResource");
var httpOperationResponse_1 = require("../lib/httpOperationResponse");
var logFilter_1 = require("../lib/filters/logFilter");
describe('Log filter', function () {
    it('should log messages when a logger object is provided', function (done) {
        var expected = ">> Request: {\n  \"headers\": {},\n  \"rawResponse\": false,\n  \"url\": \"https://foo.com\",\n  \"method\": \"PUT\",\n  \"body\": {\n    \"a\": 1\n  },\n  \"formData\": null\n}\n>> Response status code: 200\n>> Body: null\n";
        var output = '';
        var logger = function (message) { output += message + '\n'; };
        var lf = new logFilter_1["default"](logger);
        var req = new webResource_1.WebResource('https://foo.com', 'PUT', { "a": 1 });
        var res = new nodeFetch.Response();
        var opRes = new httpOperationResponse_1["default"](req, res);
        lf.after(opRes).then(function () {
            assert.deepEqual(output, expected);
            done();
        });
    });
});
