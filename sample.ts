'use strict';

import * as msRest from './lib/msRest';
const clientOptions: msRest.ServiceClientOptions = {
  filters: [new msRest.LogFilter()]
};
const client = new msRest.ServiceClient(null, clientOptions);
let req: msRest.RequestPrepareOptions = {
  url: 'http://petstore.swagger.io/v2/pet/2',
  method: msRest.HttpMethods.GET,
  disableClientRequestId: true
};

client.sendRequest(req).then(function (res: msRest.HttpOperationResponse) {
  document.write(res.body as string);
});