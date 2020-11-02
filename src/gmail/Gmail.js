export function loadGmailApi() {
  const script = document.createElement('script');

  script.onload = () => {
    init(script);
  };
  script.src = 'https://apis.google.com/js/client.js';

  document.body.appendChild(script);
}

export async function init(script) {
  if (script.getAttribute('gapi_processed')) {
    console.log('gmail API LOADED!');
    const DISCOVERY_DOCS = [
      'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    ];
    const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
    const clientId = process.env.REACT_APP_GMAIL_CLIENT_ID;
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
        console.log('init!!');
      });
    });
  } else {
    console.log('API NOT YET LOADED');
    setTimeout(() => {
      init(script);
    }, 100);
  }
}
