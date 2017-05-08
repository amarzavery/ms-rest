"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
exports.__esModule = true;
var assert = require("assert");
var should = require("should");
var webResource_1 = require("../lib/webResource");
var msRestUserAgentFilter_1 = require("../lib/filters/msRestUserAgentFilter");
var userAgentHeader = 'user-agent';
describe('ms-rest user agent filter', function () {
    it('should construct user agent header when supplied empty array', function (done) {
        var userAgentArray = [];
        var userAgentFilter = new msRestUserAgentFilter_1["default"](userAgentArray);
        var resource = new webResource_1.WebResource();
        resource.headers = {};
        userAgentFilter.before(resource).then(function (resource) {
            should.ok(resource);
            resource.headers[userAgentHeader].should.containEql('Node');
            resource.headers[userAgentHeader].should.containEql('Azure-SDK-For-Node');
            done();
        });
    });
    it('should not modify user agent header if already present', function (done) {
        var genericRuntime = 'ms-rest';
        var azureRuntime = 'ms-rest-azure';
        var azureSDK = 'Azure-SDK-For-Node';
        var userAgentArray = [genericRuntime + "/v1.0.0", azureRuntime + "/v1.0.0"];
        var userAgentFilter = new msRestUserAgentFilter_1["default"](userAgentArray);
        var customUA = 'my custom user agent';
        var resource = new webResource_1.WebResource();
        resource.headers = { 'user-agent': customUA };
        userAgentFilter.before(resource).then(function (resource) {
            should.ok(resource);
            var actualUA = resource.headers[userAgentHeader];
            actualUA.should.not.containEql('Node');
            actualUA.should.not.containEql(azureSDK);
            actualUA.should.not.containEql(azureRuntime);
            actualUA.should.containEql(customUA);
            done();
        });
    });
    it('should insert azure-sdk-for-node at right position', function (done) {
        var genericRuntime = 'ms-rest';
        var azureRuntime = 'ms-rest-azure';
        var azureSDK = 'Azure-SDK-For-Node';
        var userAgentArray = [genericRuntime + "/v1.0.0", azureRuntime + "/v1.0.0"];
        var userAgentFilter = new msRestUserAgentFilter_1["default"](userAgentArray);
        var resource = new webResource_1.WebResource();
        resource.headers = {};
        userAgentFilter.before(resource).then(function (resource) {
            should.ok(resource);
            var deconstructedUserAgent = resource.headers[userAgentHeader].split(' ');
            should.ok(deconstructedUserAgent);
            var indexOfAzureRuntime = deconstructedUserAgent.findIndex(function (e) { return e.startsWith(azureRuntime); });
            assert.notEqual(indexOfAzureRuntime, -1, "did not find " + azureRuntime + " in user agent");
            var indexOfAzureSDK = deconstructedUserAgent.indexOf(azureSDK);
            assert.notEqual(indexOfAzureSDK, -1, "did not find " + azureSDK + " in user agent");
            assert.equal(indexOfAzureSDK, 1 + indexOfAzureRuntime, azureSDK + " is not in the right place in user agent string");
            done();
        });
    });
});
