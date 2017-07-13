"use strict";

import * as msRest from "./lib/msRest";
const clientOptions: msRest.ServiceClientOptions = {
  filters: [new msRest.LogFilter()]
};

const subscriptionId = "00977cdb-163f-435f-9c32-39ec8ae61f4d";
// An easy way to get the token
// 1. Go to this test drive link https://azure.github.io/projects/apis and authenticate by clicking on Authorize. Check the user impersoantion checkbox in the popup.
// 1.1 select a subscription of your choice
// 1.2 select the storage-2015-06-15 option from the first drop down list
// 1.3 expand the url to list storage accounts in a subscription
// 1.4 click on try it out button.
// 1.5 in the curl tab you will see the actual curl request that has the bearer token in it
// 1.6 copy paste that token here. That token is valid for 1 hour
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyIsImtpZCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE0OTk5MjE1NTYsIm5iZiI6MTQ5OTkyMTU1NiwiZXhwIjoxNDk5OTI1NDU2LCJhY3IiOiIxIiwiYWlvIjoiQVNRQTIvOERBQUFBQ2VoU0ErUG9xUjk1WjlHVisvMWFBOWNpY01icTYvSUZkZDRmUzlmVFBibz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiZmJmYzdhNzEtMjU2Yi00NTRhLWJmMjctMTIxNjJmNjMwZTBhIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJaYXZlcnkiLCJnaXZlbl9uYW1lIjoiQW1hciIsImhhc2dyb3VwcyI6InRydWUiLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjczLjE2OS4xNDkuMTEwIiwibmFtZSI6IkFtYXIgWmF2ZXJ5Iiwib2lkIjoiMTk2MWVhYmYtMjE1Ny00YzQzLTk0NDEtYTZkMDQ5ZDA1Y2RhIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxMjc1MjExODQtMTYwNDAxMjkyMC0xODg3OTI3NTI3LTExODM0MTQ0IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMwMDAwODVCMzJDNTUiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJrUzVhZGt6bXJiSDZuOUhCY0RzbVRQTmlFX0pIeHhOazRIUGpCUWQ5WkcwIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJhbXphdmVyeUBtaWNyb3NvZnQuY29tIiwidXBuIjoiYW16YXZlcnlAbWljcm9zb2Z0LmNvbSIsInZlciI6IjEuMCJ9.hridI8eJ_glFem0DaxzeMNgXQIEwaDI3rpgWdA5Mvx5RaQ22P2-gro0p2lZdDABlEjjPUP624SN93GvA0mQq9zFoLzfGtemd1QkWKXTXs97H714iaoawy7azUcNxZjqBu61Oe8BxlMImTeo4g53UQiPOjFhAr2g5Ld1JGle6CepEp5yyeOP6uuOFn6cANNMcxDwr6jrNkmdQj6XKQ8tCTKP57aw8naaqZ8jp0DOCaiy3SjRsxfzHFLdhRtlMGaPKlC8_iVF6J4PwJRruUf0tJpBszUKuxHaTFhp93JJ8hPzlZiXO4QNtw5lCQCnfB0sxsHi39vEG-Ue9csA9E5kl5A";
const creds = new msRest.TokenCredentials(token);
const client = new msRest.ServiceClient(creds, clientOptions);
const req: msRest.RequestPrepareOptions = {
  url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2015-06-15`,
  method: 'GET'
};

client.sendRequest(req).then(function (res: msRest.HttpOperationResponse) {
  document.write(res.body as string);
});
