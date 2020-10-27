import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../css/style.css';

function Dashboard({ auth }) {
  let history = useHistory();
  // console.log(auth.auth);

  function sendEmail() {
    console.log(window.gapi.auth2.getAuthInstance().isSignedIn.get());
    const message =
      `From: danielmamnev@gmail.com.\r\n` +
      `To: daniksk9@gmail.com\r\n` +
      `Subject: test1\r\n\r\n` +
      `test body`;
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    window.gapi.client.gmail.users.messages
      .send({
        userId: 'me',
        resource: {
          raw: reallyEncodedMessage,
        },
      })
      .then(() => {
        console.log('email sent');
      });
  }

  if (auth.auth == null) {
    setTimeout(() => {
      history.push('/login');
    }, 1000);
  }
  return (
    <div>
      {auth.auth ? (
        <div>
          Congratulations. This is the Dashboard. This is protected.
          <button onClick={sendEmail}>Send an email</button>
        </div>
      ) : (
        <div className="display-i-b">
          <div className="loader"></div>Redirecting to login
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Dashboard);
