import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig)
console.log('firebase initialized')
const provider = new firebase.auth.GoogleAuthProvider();


provider.addScope('https://mail.google.com/');

export function signIn() {
const GoogleAuth = window.gapi.auth2.getAuthInstance();

  firebase.auth().signInWithPopup(provider).then(() => {
    if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      GoogleAuth.signIn();
    }
  });
}

export default firebase;
