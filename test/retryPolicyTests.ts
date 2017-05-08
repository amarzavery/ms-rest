// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from 'assert';
import * as nodeFetch from 'node-fetch';
import { WebResource } from '../lib/webResource';
import HttpOperationResponse from '../lib/httpOperationResponse';
import ExponentialRetryPolicyFilter from '../lib/filters/exponentialRetryPolicyFilter';
import SystemErrorRetryPolicyFilter from '../lib/filters/systemErrorRetryPolicyFilter';
//TODO: This needs to be revisited as the design of retry filter is not yet correct.
describe.skip('exponentialretrypolicyfilter-unittests', function () {
  it('RetrySucceedsOnHttp408StatusCode', function (done) {
    let retryCount = 2;
    let retryInterval = 2;
    let minRetryInterval = 1;
    let maxRetryInterval = 10;

    let response = new nodeFetch.Response();
    response.status = 408;
    let mockNextGenerator = () => {
      let timesCalled = 0;
      return function (options, retryCallback) {
        if (timesCalled == 0) {
          timesCalled++;
          retryCallback(true, response, null);
        } else {
          done();
        }
      };
    };

    let mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
    let req = new WebResource();
    let opRes = new HttpOperationResponse(req, response);
    mockRetryPolicyFilter.after(opRes).then((opRes) => {
      console.log(opRes);
    });
  });

  // it('RetrySucceedsOnHttp502StatusCode', function (done) {
  //   var retryCount = 2;
  //   var retryInterval = 2;
  //   var minRetryInterval = 1;
  //   var maxRetryInterval = 10;

  //   var response = { 'statusCode': 502 };
  //   var mockNextGenerator = function () {
  //     var timesCalled = 0;
  //     return function (options, retryCallback) {
  //       if (timesCalled == 0) {
  //         timesCalled++;
  //         retryCallback(true, response, null);
  //       } else {
  //         done();
  //       }
  //     };
  //   };

  //   var mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
  //   mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
  //     throw "Fail to retry on HTTP 502";
  //   });
  // });

  // it('DoesNotRetryOnHttp404StatusCode', function (done) {
  //   var retryCount = 2;
  //   var retryInterval = 2;
  //   var minRetryInterval = 1;
  //   var maxRetryInterval = 10;

  //   var response = { 'statusCode': 404 };
  //   var mockNextGenerator = function () {
  //     var timesCalled = 0;
  //     return function (options, retryCallback) {
  //       if (timesCalled == 0) {
  //         timesCalled++;
  //         retryCallback(true, response, null);
  //       } else {
  //         throw "Should not retry on HTTP 404";
  //       }
  //     };
  //   };

  //   var mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
  //   mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
  //     done();
  //   });
  // });

  // it('DoesNotRetryOnHttp501StatusCode', function (done) {
  //   var retryCount = 2;
  //   var retryInterval = 2;
  //   var minRetryInterval = 1;
  //   var maxRetryInterval = 10;

  //   var response = { 'statusCode': 501 };
  //   var mockNextGenerator = function () {
  //     var timesCalled = 0;
  //     return function (options, retryCallback) {
  //       if (timesCalled == 0) {
  //         timesCalled++;
  //         retryCallback(true, response, null);
  //       } else {
  //         throw "Should not retry on HTTP 501";
  //       }
  //     };
  //   };

  //   var mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
  //   mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
  //     done();
  //   });
  // });

  // it('DoesNotRetryOnHttp505StatusCode', function (done) {
  //   var retryCount = 2;
  //   var retryInterval = 2;
  //   var minRetryInterval = 1;
  //   var maxRetryInterval = 10;

  //   var response = { 'statusCode': 505 };
  //   var mockNextGenerator = function () {
  //     var timesCalled = 0;
  //     return function (options, retryCallback) {
  //       if (timesCalled == 0) {
  //         timesCalled++;
  //         retryCallback(true, response, null);
  //       } else {
  //         throw "Should not retry on HTTP 505";
  //       }
  //     };
  //   };

  //   var mockRetryPolicyFilter = new ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
  //   mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
  //     done();
  //   });
  // });
});

// describe('systemErrorRetrypolicyfilter-unittests', function () {
//   it('DoesNotRetryOn_ENOTFOUND_ErrorCode', function (done) {
//     var retryCount = 2;
//     var retryInterval = 2;
//     var minRetryInterval = 1;
//     var maxRetryInterval = 10;

//     var response = { 'statusCode': 502 };
//     var e = new Error('ENOTFOUND');
//     e.code = 'ENOTFOUND';
//     e.errno = 'ENOTFOUND';
//     e.syscall = 'getaddrinfo';
//     e.hostname = 'testkv602.vault.azure.net';
//     e.host = 'testkv602.vault.azure.net';
//     e.port = 443;
//     var mockNextGenerator = function () {
//       var timesCalled = 0;
//       return function (options, retryCallback) {
//         if (timesCalled == 0) {
//           timesCalled++;
//           retryCallback(e, null, null);
//         } else {
//           throw 'Should not Retry on ENOTFOUND ErrorCode';

//         }
//       };
//     };

//     var mockRetryPolicyFilter = new SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
//     mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
//       done();
//     });
//   });

//   it('RetrySucceedsOn_ECONNRESET_ErrorCode', function (done) {
//     var retryCount = 2;
//     var retryInterval = 2;
//     var minRetryInterval = 1;
//     var maxRetryInterval = 10;

//     var response = { 'statusCode': 502 };
//     var e = new Error('ECONNRESET');
//     e.code = 'ECONNRESET';
//     e.errno = 'ECONNRESET';
//     e.syscall = 'getaddrinfo';
//     e.hostname = 'testkv602.vault.azure.net';
//     e.host = 'testkv602.vault.azure.net';
//     e.port = 443;
//     var mockNextGenerator = function () {
//       var timesCalled = 0;
//       return function (options, retryCallback) {
//         if (timesCalled == 0) {
//           timesCalled++;
//           retryCallback(e, null, null);
//         } else {
//           done();
//         }
//       };
//     };

//     var mockRetryPolicyFilter = new SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
//     mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
//       throw 'Retry does not succeed on ECONNRESET ErrorCode';
//     });
//   });

//   it('RetrySucceedsOn_ECONNREFUSED_ErrorCode', function (done) {
//     var retryCount = 2;
//     var retryInterval = 2;
//     var minRetryInterval = 1;
//     var maxRetryInterval = 10;

//     var response = { 'statusCode': 502 };
//     var e = new Error('ECONNREFUSED');
//     e.code = 'ECONNREFUSED';
//     e.errno = 'ECONNREFUSED';
//     e.syscall = 'getaddrinfo';
//     e.hostname = 'testkv602.vault.azure.net';
//     e.host = 'testkv602.vault.azure.net';
//     e.port = 443;
//     var mockNextGenerator = function () {
//       var timesCalled = 0;
//       return function (options, retryCallback) {
//         if (timesCalled == 0) {
//           timesCalled++;
//           retryCallback(e, null, null);
//         } else {
//           done();
//         }
//       };
//     };

//     var mockRetryPolicyFilter = new SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
//     mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
//       throw 'Retry does not succeed on ECONNREFUSED ErrorCode';
//     });
//   });

//   it('RetrySucceedsOn_ETIMEDOUT_ErrorCode', function (done) {
//     var retryCount = 2;
//     var retryInterval = 2;
//     var minRetryInterval = 1;
//     var maxRetryInterval = 10;

//     var response = { 'statusCode': 502 };
//     var e = new Error('ETIMEDOUT');
//     e.code = 'ETIMEDOUT';
//     e.errno = 'ETIMEDOUT';
//     e.syscall = 'getaddrinfo';
//     e.hostname = 'testkv602.vault.azure.net';
//     e.host = 'testkv602.vault.azure.net';
//     e.port = 443;
//     var mockNextGenerator = function () {
//       var timesCalled = 0;
//       return function (options, retryCallback) {
//         if (timesCalled == 0) {
//           timesCalled++;
//           retryCallback(e, null, null);
//         } else {
//           done();
//         }
//       };
//     };

//     var mockRetryPolicyFilter = new SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
//     mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
//       throw 'Retry does not succeed on ETIMEDOUT ErrorCode';
//     });
//   });

//   it('RetrySucceedsOn_ESOCKETTIMEDOUT_ErrorCode', function (done) {
//     var retryCount = 2;
//     var retryInterval = 2;
//     var minRetryInterval = 1;
//     var maxRetryInterval = 10;

//     var response = { 'statusCode': 502 };
//     var e = new Error('ESOCKETTIMEDOUT');
//     e.code = 'ESOCKETTIMEDOUT';
//     e.errno = 'ESOCKETTIMEDOUT';
//     e.syscall = 'getaddrinfo';
//     e.hostname = 'testkv602.vault.azure.net';
//     e.host = 'testkv602.vault.azure.net';
//     e.port = 443;
//     var mockNextGenerator = function () {
//       var timesCalled = 0;
//       return function (options, retryCallback) {
//         if (timesCalled == 0) {
//           timesCalled++;
//           retryCallback(e, null, null);
//         } else {
//           done();
//         }
//       };
//     };

//     var mockRetryPolicyFilter = new SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval);
//     mockRetryPolicyFilter(null, mockNextGenerator(), function (err, result, response, body) {
//       throw 'Retry does not succeed on ESOCKETTIMEDOUT ErrorCode';
//     });
//   });
// });