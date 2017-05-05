// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import BaseFilter from './baseFilter';
import { WebResource } from '../webResource';
import ServiceClientCredentials from '../credentials/serviceClientCredentials';

class SigningFilter extends BaseFilter {

  authenticationProvider: ServiceClientCredentials;

  constructor(authenticationProvider: ServiceClientCredentials) {
    super();
    this.authenticationProvider = authenticationProvider;
  }

  before(request: WebResource): Promise<WebResource> {
    let self = this;
    return self.authenticationProvider.signRequest(request);
  }
}

export default SigningFilter;