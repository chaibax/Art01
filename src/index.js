import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-wrapper";
import config from "./auth_config.json";
import history from "./utils/history";


if(window.location.hostname != 'localhost'){
  if(window.location.protocol != 'https:') {
    window.location.href = window.location.href.replace("http://", "https://");
  }
}



// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};


ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    audience={config.audience}  
    onRedirectCallback={onRedirectCallback}
    history={history}
    
>
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();