// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { BaseFilter } from './baseFilter';
export class LogFilter extends BaseFilter {
    constructor(logger = console.log) {
        super();
        this.logger = logger;
    }
    after(operationResponse) {
        const self = this;
        self.logger(`>> Request: ${JSON.stringify(operationResponse.request, undefined, 2)}`);
        self.logger(`>> Response status code: ${operationResponse.response.status}`);
        let responseBody = operationResponse.bodyAsText;
        self.logger(`>> Body: ${responseBody}`);
        return Promise.resolve(operationResponse);
    }
}
//# sourceMappingURL=logFilter.js.map