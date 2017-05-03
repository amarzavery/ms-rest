// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import WebResource from '../webResource';

interface ServiceClientCredentials {
  /**
   * Signs a request with the Authentication header.
   *
   * @param {WebResource} The WebResource to be signed.
   * @param {function(error)}  callback  The callback function.
   */
  signRequest(webResource: WebResource, callback: { (err: Error): void }): void;
}

export default ServiceClientCredentials;