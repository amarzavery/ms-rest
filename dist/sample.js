'use strict';
exports.__esModule = true;
var msRest = require("./lib/msRest");
var clientOptions = {
    filters: [new msRest.LogFilter()]
};
var client = new msRest.ServiceClient(null, clientOptions);
var req = {
    url: 'http://petstore.swagger.io/v2/pet/1',
    method: msRest.HttpMethods.GET
};
client.sendRequest(req).then(function (res) {
    console.dir(res.body);
});
