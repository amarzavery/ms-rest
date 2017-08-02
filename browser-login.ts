import { authManager } from "./AuthConstants";

authManager.handleWindowCallback();
if (!authManager.getCachedUser()) {
  authManager.login();
}





