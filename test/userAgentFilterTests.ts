// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from 'assert';
import * as should from 'should';
import { WebResource } from '../lib/webResource';
import UserAgentFilter from '../lib/filters/msRestUserAgentFilter';
const userAgentHeader: string = 'user-agent';

describe('ms-rest user agent filter', () => {

  it('should construct user agent header when supplied empty array', (done) => {
    var userAgentArray: Array<string> = [];
    var userAgentFilter = new UserAgentFilter(userAgentArray);
    var resource = new WebResource();
    resource.headers = {};
    userAgentFilter.before(resource).then((resource) => {
      should.ok(resource);
      resource.headers[userAgentHeader].should.containEql('Node');
      resource.headers[userAgentHeader].should.containEql('Azure-SDK-For-Node');
      done();
    });
  });

  it('should not modify user agent header if already present', (done) => {
    var genericRuntime = 'ms-rest';
    var azureRuntime = 'ms-rest-azure';
    var azureSDK = 'Azure-SDK-For-Node';
    var userAgentArray = [`${genericRuntime}/v1.0.0`, `${azureRuntime}/v1.0.0`];

    var userAgentFilter = new UserAgentFilter(userAgentArray);
    var customUA = 'my custom user agent';
    var resource = new WebResource();
    resource.headers = { 'user-agent': customUA };
    userAgentFilter.before(resource).then((resource) => {
      should.ok(resource);
      var actualUA = resource.headers[userAgentHeader];
      actualUA.should.not.containEql('Node');
      actualUA.should.not.containEql(azureSDK);
      actualUA.should.not.containEql(azureRuntime);
      actualUA.should.containEql(customUA);
      done();
    });
  });

  it('should insert azure-sdk-for-node at right position', (done) => {
    var genericRuntime = 'ms-rest';
    var azureRuntime = 'ms-rest-azure';
    var azureSDK = 'Azure-SDK-For-Node';
    var userAgentArray = [`${genericRuntime}/v1.0.0`, `${azureRuntime}/v1.0.0`];
    var userAgentFilter = new UserAgentFilter(userAgentArray);
    var resource = new WebResource();
    resource.headers = {};
    userAgentFilter.before(resource).then((resource) => {
      should.ok(resource);
      var deconstructedUserAgent = resource.headers[userAgentHeader].split(' ');
      should.ok(deconstructedUserAgent);
      var indexOfAzureRuntime = deconstructedUserAgent.findIndex((e) => e.startsWith(azureRuntime));
      assert.notEqual(indexOfAzureRuntime, -1, `did not find ${azureRuntime} in user agent`);
      var indexOfAzureSDK = deconstructedUserAgent.indexOf(azureSDK);
      assert.notEqual(indexOfAzureSDK, -1, `did not find ${azureSDK} in user agent`);
      assert.equal(indexOfAzureSDK, 1 + indexOfAzureRuntime, `${azureSDK} is not in the right place in user agent string`);
      done();
    });
  });
});
