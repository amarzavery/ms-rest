// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var baseFilter_1 = require("./baseFilter");
var utils = require("../util/utils");
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
var SystemErrorRetryPolicyFilter = (function (_super) {
    __extends(SystemErrorRetryPolicyFilter, _super);
    function SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
        var _this = _super.call(this) || this;
        _this.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
        _this.DEFAULT_CLIENT_RETRY_COUNT = 3;
        _this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
        _this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
        _this.retryCount = retryCount || _this.DEFAULT_CLIENT_RETRY_COUNT;
        _this.retryInterval = retryInterval || _this.DEFAULT_CLIENT_RETRY_INTERVAL;
        _this.minRetryInterval = minRetryInterval || _this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
        _this.maxRetryInterval = maxRetryInterval || _this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
        return _this;
    }
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param {number} statusCode The HTTP status code.
     * @param {RetryData} retryData  The retry data.
     * @return {boolean} True if the operation qualifies for a retry; false otherwise.
     */
    SystemErrorRetryPolicyFilter.prototype.shouldRetry = function (retryData) {
        var currentCount;
        if (!retryData) {
            throw new Error('retryData for the SystemErrorRetryPolicyFilter cannot be null.');
        }
        else {
            currentCount = (retryData && retryData.retryCount);
        }
        return (currentCount < this.retryCount);
    };
    /**
     * Updates the retry data for the next attempt.
     *
     * @param {RetryData} retryData  The retry data.
     * @param {object} err        The operation's error, if any.
     */
    SystemErrorRetryPolicyFilter.prototype.updateRetryData = function (retryData, err) {
        if (!retryData) {
            retryData = {
                retryCount: 0,
                error: null
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
        var incrementDelta = Math.pow(2, retryData.retryCount) - 1;
        var boundedRandDelta = this.retryInterval * 0.8 +
            Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;
        retryData.retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);
        return retryData;
    };
    SystemErrorRetryPolicyFilter.prototype.retry = function (operationResponse, retryData, err) {
        var self = this;
        retryData = self.updateRetryData(retryData, err);
        if (!utils.objectIsNull(err) && self.shouldRetry(retryData) &&
            (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT' || err.code === 'ECONNREFUSED' ||
                err.code === 'ECONNRESET' || err.code === 'ENOENT')) {
            // If previous operation ended with an error and the policy allows a retry, do that
            return utils.delay(retryData.retryInterval).then(function () {
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
    };
    SystemErrorRetryPolicyFilter.prototype.after = function (operationResponse) {
        return this.retry(operationResponse, null, null);
    };
    return SystemErrorRetryPolicyFilter;
}(baseFilter_1["default"]));
exports["default"] = SystemErrorRetryPolicyFilter;
