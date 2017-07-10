// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
'use strict';
class BaseFilter {
    constructor() { }
    before(request) {
        return Promise.resolve(request);
    }
    after(response) {
        return Promise.resolve(response);
    }
}
export default BaseFilter;
