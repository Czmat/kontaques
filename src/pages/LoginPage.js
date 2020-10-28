import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase, { signIn } from '../firebase/firebase';

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://mail.google.com/');

function LoginPage({ auth, dispatch }) {
  useEffect(() => {
    // contactCollection.get().then((snapshot) => {
    //   const data = snapshot.docs.map((d) => d.data());
    //   console.log('snapshot', data);
    //   dispatch({ type: 'GET_CONTACTS', payload: data });
    // });
  }, [auth.auth]);

  if (auth.auth) {
    const contactCollection = firebase
      .firestore()
      .collection(`users/${auth.auth.uid}/contacts`);

    contactCollection.get().then((snapshot) => {
      const data = snapshot.docs.map((d) => d.data());
      console.log('snapshot', data);
      dispatch({ type: 'GET_CONTACTS', payload: data });
    });
  }

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
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            //getting user and setting it to state
            const user = result.user;
            dispatch({ type: 'AUTH_USER', payload: user });
            //function to create user if not exists
            createCollectionUsers(user);
          });
      });
  }

  // create collection users if not created and add user
  const createCollectionUsers = (user) => {
    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const userDoc = usersCollection.doc(user.uid);

    userDoc.get().then((doc) => {
      if (!doc.exists) {
        // console.log('my doc', doc);
        userDoc.set({
          username: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
          photoUrl: user.photoURL,
          refreshToken: user.refreshToken,
        });
      } else {
        return console.log('user exists');
      }
    });
  };

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
