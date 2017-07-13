// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const baseFilter_1 = require("./baseFilter");
const utils = require("../util/utils");
/**
 * @class
 * Instantiates a new 'ExponentialRetryPolicyFilter' instance.
 *
 * @constructor
 * @param {number} retryCount        The client retry count.
 * @param {number} retryInterval     The client retry interval, in milliseconds.
 * @param {number} minRetryInterval  The minimum retry interval, in milliseconds.
 * @param {number} maxRetryInterval  The maximum retry interval, in milliseconds.
 */
class SystemErrorRetryPolicyFilter extends baseFilter_1.BaseFilter {
    constructor(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
        super();
        this.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
        this.DEFAULT_CLIENT_RETRY_COUNT = 3;
        this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
        this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
        this.retryCount = retryCount || this.DEFAULT_CLIENT_RETRY_COUNT;
        this.retryInterval = retryInterval || this.DEFAULT_CLIENT_RETRY_INTERVAL;
        this.minRetryInterval = minRetryInterval || this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
        this.maxRetryInterval = maxRetryInterval || this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
    }
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param {number} statusCode The HTTP status code.
     * @param {RetryData} retryData  The retry data.
     * @return {boolean} True if the operation qualifies for a retry; false otherwise.
     */
    shouldRetry(retryData) {
        let currentCount;
        if (!retryData) {
            throw new Error('retryData for the SystemErrorRetryPolicyFilter cannot be null.');
        }
        else {
            currentCount = (retryData && retryData.retryCount);
        }
        return (currentCount < this.retryCount);
    }
    /**
     * Updates the retry data for the next attempt.
     *
     * @param {RetryData} retryData  The retry data.
     * @param {object} err        The operation's error, if any.
     */
    updateRetryData(retryData, err) {
        if (!retryData) {
            retryData = {
                retryCount: 0,
                error: undefined
            };
        }
        if (err) {
            if (retryData.error) {
                err.innerError = retryData.error;
            }
            retryData.error = err;
        }
        // Adjust retry count
        retryData.retryCount++;
        // Adjust retry interval
        let incrementDelta = Math.pow(2, retryData.retryCount) - 1;
        const boundedRandDelta = this.retryInterval * 0.8 +
            Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;
        retryData.retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);
        return retryData;
    }
    retry(operationResponse, retryData, err) {
        const self = this;
        retryData = self.updateRetryData(retryData, err);
        if (!utils.objectIsNull(err) && self.shouldRetry(retryData) &&
            (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT' || err.code === 'ECONNREFUSED' ||
                err.code === 'ECONNRESET' || err.code === 'ENOENT')) {
            // If previous operation ended with an error and the policy allows a retry, do that
            return utils.delay(retryData.retryInterval).then(() => {
                return self.retry(operationResponse, retryData, err);
            });
        }
        else {
            if (!utils.objectIsNull(err)) {
                // If the operation failed in the end, return all errors instead of just the last one
                err = retryData.error;
                return Promise.reject(err);
            }
            return Promise.resolve(operationResponse);
        }
    }
    after(operationResponse) {
        return this.retry(operationResponse, null, null); // TODO Audit usages of null. See: https://github.com/Microsoft/TypeScript/issues/7426
    }
}
exports.SystemErrorRetryPolicyFilter = SystemErrorRetryPolicyFilter;
//# sourceMappingURL=systemErrorRetryPolicyFilter.js.map