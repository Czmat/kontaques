import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig)
console.log('firebase initialized')
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://mail.google.com/');

export function signIn() {
  firebase.auth().signInWithPopup(provider);
}

export default firebase;
