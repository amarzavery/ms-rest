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
import { RequestPipeline } from './requestPipeline';
import { ExponentialRetryPolicyFilter } from './filters/exponentialRetryPolicyFilter';
import { SystemErrorRetryPolicyFilter } from './filters/systemErrorRetryPolicyFilter';
import { SigningFilter } from './filters/signingFilter';
import { MsRestUserAgentFilter } from './filters/msRestUserAgentFilter';
import { WebResource } from './webResource';
import { Constants } from './util/constants';
/**
 * @class
 * Initializes a new instance of the ServiceClient.
 * @constructor
 * @param {ServiceClientCredentials} [credentials]    - BasicAuthenticationCredentials or
 * TokenCredentials object used for authentication.
 *
 * @param {ServiceClientOptions} [options] The service client options that govern the behavior of the client.
 */
export class ServiceClient {
    constructor(credentials, options) {
        if (!options) {
            options = {};
        }
        if (!options.requestOptions) {
            options.requestOptions = {};
        }
        if (!options.filters) {
            options.filters = [];
        }
        this.userAgentInfo = { value: [] };
        if (credentials && !credentials.signRequest) {
            throw new Error('credentials argument needs to implement signRequest method');
        }
        try {
            const moduleName = 'ms-rest';
            const moduleVersion = Constants.msRestVersion;
            this.addUserAgentInfo(`${moduleName}/${moduleVersion}`);
        }
        catch (err) {
            // do nothing
        }
        if (credentials) {
            options.filters.push(new SigningFilter(credentials));
        }
        options.filters.push(new MsRestUserAgentFilter(this.userAgentInfo.value));
        if (!options.noRetryPolicy) {
            options.filters.push(new ExponentialRetryPolicyFilter());
            options.filters.push(new SystemErrorRetryPolicyFilter());
        }
        this.pipeline = new RequestPipeline(options.filters, options.requestOptions).create();
    }
    /**
     * Adds custom information to user agent header
     * @param {any} additionalUserAgentInfo - information to be added to user agent header, as string.
     */
    addUserAgentInfo(additionalUserAgentInfo) {
        if (this.userAgentInfo.value.indexOf(additionalUserAgentInfo) === -1) {
            this.userAgentInfo.value.push(additionalUserAgentInfo);
        }
        return;
    }
    sendRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === null || options === undefined || typeof options !== 'object') {
                throw new Error('options cannot be null or undefined and it must be of type object.');
            }
            let httpRequest;
            try {
                if (options instanceof WebResource) {
                    options.validateRequestProperties();
                    httpRequest = options;
                }
                else {
                    httpRequest = new WebResource();
                    httpRequest = httpRequest.prepare(options);
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
            // send request
            let operationResponse;
            try {
                operationResponse = yield this.pipeline(httpRequest);
            }
            catch (err) {
                return Promise.reject(err);
            }
            return Promise.resolve(operationResponse);
        });
    }
}
//# sourceMappingURL=serviceClient.js.map