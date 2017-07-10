// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
'use strict';
import BaseFilter from './baseFilter';
class SigningFilter extends BaseFilter {
    constructor(authenticationProvider) {
        super();
        this.authenticationProvider = authenticationProvider;
    }
    before(request) {
        const self = this;
        return self.authenticationProvider.signRequest(request);
    }
}
export default SigningFilter;
