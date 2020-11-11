import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);
console.log('firebase initialized');
const provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://mail.google.com/');

export function signIn() {
  const gapi = window.gapi;

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(() => {
      const authInstance = gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        authInstance.signIn();
        console.log('AUTH2 SIGN in');
      }
    });
}

export default firebase;
