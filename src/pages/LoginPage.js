import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase, { signIn } from '../firebase/firebase';

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://mail.google.com/');

function LoginPage({ auth, dispatch }) {
  let history = useHistory();
  let location = useLocation();

  if (auth.auth) {
    history.push('/dashboard');
  }
  function loginHandler() {
    firebase
      .auth()
      .setPersistence('local')
      .then(() => {
        firebase.auth().signInWithPopup(provider);
      });
  }

  return (
    <div>
      <button onClick={loginHandler}>Log In</button>
    </div>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LoginPage);
