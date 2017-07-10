// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';
import { WebResource, RequestPrepareOptions, HttpMethods, ParameterValue, RequestOptions } from './webResource';
import HttpOperationResponse from './httpOperationResponse';
import RestError from './restError';
import { ServiceClient, ServiceClientOptions } from './serviceClient';
import Constants from './util/constants';
import RequestPipeline from './requestPipeline';
import LogFilter from './filters/logFilter';
import BaseFilter from './filters/baseFilter';
import ExponentialRetryPolicyFilter from './filters/exponentialRetryPolicyFilter';
import SystemErrorRetryPolicyFilter from './filters/systemErrorRetryPolicyFilter';
import SigningFilter from './filters/signingFilter';
import UserAgentFilter from './filters/msRestUserAgentFilter';
import { stripRequest, stripResponse, delay, executePromisesSequentially, generateUuid, encodeUri } from './util/utils';

// Credentials
import TokenCredentials from './credentials/tokenCredentials';
import BasicAuthenticationCredentials from './credentials/basicAuthenticationCredentials';
import ServiceClientCredentials from './credentials/serviceClientCredentials';

export {
  WebResource, RequestPrepareOptions, HttpMethods, ParameterValue, HttpOperationResponse, ServiceClient, Constants, RequestPipeline, TokenCredentials,
  BasicAuthenticationCredentials, ServiceClientCredentials, BaseFilter, LogFilter, ServiceClientOptions, ExponentialRetryPolicyFilter,
  SystemErrorRetryPolicyFilter, SigningFilter, UserAgentFilter, stripRequest, stripResponse, delay, executePromisesSequentially,
  generateUuid, encodeUri, RestError, RequestOptions
};
