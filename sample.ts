'use strict';

import * as msRest from './lib/msRest';
const clientOptions: msRest.ServiceClientOptions = {
  filters: [new msRest.LogFilter()]
};
const client = new msRest.ServiceClient(null, clientOptions);
let req: msRest.WebResource = {
  url: 'http://petstore.swagger.io/v2/pet/1',
  method: 'GET'
};

client.pipeline(req).then(function (res) {
  console.dir(res.body);
});