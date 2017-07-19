"use strict";

import * as msRest from "./lib/msRest";
const clientOptions: msRest.ServiceClientOptions = {
  filters: [new msRest.LogFilter()]
};

const subscriptionId = '00977cdb-163f-435f-9c32-39ec8ae61f4d';
// An easy way to get the token
// 1. Go to this test drive link https://azure.github.io/projects/apis and authenticate by clicking on Authorize. Check the user impersoantion checkbox in the popup.
// 1.1 select a subscription of your choice
// 1.2 select the storage-2015-06-15 option from the first drop down list
// 1.3 expand the url to list storage accounts in a subscription
// 1.4 click on try it out button.
// 1.5 in the curl tab you will see the actual curl request that has the bearer token in it
// 1.6 copy paste that token here. That token is valid for 1 hour
const token = 'your-token';
const creds = new msRest.TokenCredentials(token);
const client = new msRest.ServiceClient(creds, clientOptions);
const req: msRest.RequestPrepareOptions = {
  url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2015-06-15`,
  method: 'GET'
};

client.sendRequest(req).then(function (res: msRest.HttpOperationResponse) {
  console.log(res.bodyAsText);
});

