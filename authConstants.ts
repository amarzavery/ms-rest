import { AuthenticationManager } from "ms-rest-jsauth";

const config: adal.Config = {
  clientId: "4e577d28-b99d-4b38-829a-1adc38b0fab5",
  tenant: "72f988bf-86f1-41af-91ab-2d7cd011db47",
  popUp: false,
  cacheLocation: "localStorage",
  redirectUri: "http://localhost:8080/login.html"
};

// loginResource: "https://management.azure.com/",
//   resource: "https://microsoft.onmicrosoft.com/5a4e578d-4b87-4e4d-b302-cf4a9d1d01fe"

export const authManager = new AuthenticationManager(config);
