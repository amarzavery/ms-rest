// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

"use strict";

import BaseFilter from "./baseFilter";
import * as utils from "../util/utils";
import HttpOperationResponse from "../httpOperationResponse";

export interface RetryData {
  retryCount: number;
  retryInterval?: number;
  error?: RetryError;
}

export interface RetryError extends Error {
  message: string;
  code?: string;
  innerError?: RetryError;
}

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
class ExponentialRetryPolicyFilter extends BaseFilter {

  retryCount: number;
  retryInterval: number;
  minRetryInterval: number;
  maxRetryInterval: number;
  DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
  DEFAULT_CLIENT_RETRY_COUNT = 3;
  DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
  DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;

  constructor(retryCount?: number, retryInterval?: number, minRetryInterval?: number, maxRetryInterval?: number) {
    super();
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
  shouldRetry(statusCode: number, retryData: RetryData): boolean {
    if ((statusCode < 500 && statusCode !== 408) || statusCode === 501 || statusCode === 505) {
      return false;
    }

    let currentCount: number;
    if (!retryData) {
      throw new Error("retryData for the ExponentialRetryPolicyFilter cannot be null.");
    } else {
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
  updateRetryData(retryData: RetryData, err: RetryError) {
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
    let incrementDelta = Math.pow(2, retryData.retryCount) - 1;
    const boundedRandDelta = this.retryInterval * 0.8 +
      Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
    incrementDelta *= boundedRandDelta;

    retryData.retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);

    return retryData;
  }

  retry(operationResponse: HttpOperationResponse, retryData?: RetryData, err?: RetryError): Promise<HttpOperationResponse> {
    const self = this;
    const response = operationResponse.response;
    retryData = self.updateRetryData(retryData, err);
    if (!utils.objectIsNull(response) && self.shouldRetry(response.status, retryData)) {
      // If previous operation ended with an error and the policy allows a retry, do that
      return utils.delay(retryData.retryInterval).then(() => {
        return self.retry(operationResponse, retryData, err);
      });
    } else {
      if (!utils.objectIsNull(err)) {
        // If the operation failed in the end, return all errors instead of just the last one
        err = retryData.error;
        return Promise.reject(err);
      }
      return Promise.resolve(operationResponse);
    }
  }

  after(operationResponse: HttpOperationResponse): Promise<HttpOperationResponse> {
    return this.retry(operationResponse, null, null);
  }
}

export default ExponentialRetryPolicyFilter;
