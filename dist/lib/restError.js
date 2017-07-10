// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';
export default class RestError extends Error {
    constructor(message, code, statusCode, request, response, body) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.request = request;
        this.response = response;
        this.body = body;
    }
}
