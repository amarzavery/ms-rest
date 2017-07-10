// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
'use strict';
import BaseFilter from './baseFilter';
import Constants from '../util/constants';
import * as os from 'os';
const HeaderConstants = Constants.HeaderConstants;
class MsRestUserAgentFilter extends BaseFilter {
    constructor(userAgentInfo) {
        super();
        this.userAgentInfo = userAgentInfo;
    }
    tagRequest(request) {
        const osInfo = `(${os.arch()}-${os.type()}-${os.release()})`;
        if (this.userAgentInfo.indexOf(osInfo) === -1) {
            this.userAgentInfo.unshift(osInfo);
        }
        const runtimeInfo = `Node/${process.version}`;
        if (this.userAgentInfo.indexOf(runtimeInfo) === -1) {
            this.userAgentInfo.unshift(runtimeInfo);
        }
        const nodeSDKSignature = `Azure-SDK-For-Node`;
        if (this.userAgentInfo.indexOf(nodeSDKSignature) === -1) {
            const azureRuntime = `ms-rest-azure`;
            let insertIndex = this.userAgentInfo.indexOf(azureRuntime);
            // insert after azureRuntime, otherwise, insert last.
            insertIndex = insertIndex < 0 ? this.userAgentInfo.length : insertIndex + 1;
            this.userAgentInfo.splice(insertIndex, 0, nodeSDKSignature);
        }
        request.headers[HeaderConstants.USER_AGENT] = this.userAgentInfo.join(' ');
        return Promise.resolve(request);
    }
    before(request) {
        const self = this;
        if (!request.headers[HeaderConstants.USER_AGENT]) {
            return self.tagRequest(request);
        }
        else {
            return Promise.resolve(request);
        }
    }
}
export default MsRestUserAgentFilter;
