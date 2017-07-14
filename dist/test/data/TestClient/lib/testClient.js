/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator 0.14.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
/* jshint latedef:false */
/* jshint forin:false */
/* jshint noempty:false */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const msRest = require("../../../../lib/msRest");
const models = require("./models");
/**
 * @class
 * Initializes a new instance of the TestClient class.
 * @constructor
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {bool} [options.noRetryPolicy] - If set to true, turn off default retry policy
 */
class TestClient extends msRest.ServiceClient {
    constructor(baseUri, options) {
        if (!options)
            options = {};
        super(null, options);
        this.baseUri = baseUri;
        if (!this.baseUri) {
            this.baseUri = 'https://management.azure.com';
        }
        if (!this.acceptLanguage) {
            this.acceptLanguage = 'en-US';
        }
        this.models = models;
        this.serializer = new msRest.Serializer(this.models);
    }
}
exports.TestClient = TestClient;
//# sourceMappingURL=testClient.js.map