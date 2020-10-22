function loadGmailApi() {
  const script = document.createElement('script');

  script.onload = () => {
    loadClientWhenGapiReady(script);
  };
  script.src = 'https://apis.google.com/js/client.js';

  document.body.appendChild(script);
}

export async function init(apiKey, clientId) {
  const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
  ];
  const gapi = window.gapi;
  gapi.load('client', async () => {
    gapi.client.init({
      apiKey,
      discoveryDocs: DISCOVERY_DOCS,
    });
    gapi.load('auth2', async () => {
      gapi.auth2.init({
        client_id: clientId,
      });
    });
  });
}
