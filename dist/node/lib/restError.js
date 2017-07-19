"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
Object.defineProperty(exports, "__esModule", { value: true });
class RestError extends Error {
    constructor(message, code, statusCode, request, response, body) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.request = request;
        this.response = response;
        this.body = body;
    }
    mapper() {
        return {
            required: false,
            serializedName: 'CloudError',
            type: {
                name: 'Composite',
                className: 'CloudError',
                modelProperties: {
                    code: {
                        required: false,
                        serializedName: 'code',
                        type: {
                            name: 'String'
                        }
                    },
                    message: {
                        required: false,
                        serializedName: 'message',
                        type: {
                            name: 'String'
                        }
                    },
                    target: {
                        required: false,
                        serializedName: 'target',
                        type: {
                            name: 'String'
                        }
                    },
                    details: {
                        required: false,
                        serializedName: 'details',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'CloudErrorElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'CloudError'
                                }
                            }
                        }
                    }
                }
            }
        };
    }
}
exports.RestError = RestError;
//# sourceMappingURL=restError.js.map