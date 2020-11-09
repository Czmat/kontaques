import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/UI/Header/Header';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import { loadGmailApi } from './gmail/Gmail';
import ContactData from './pages/ContactData/ContactData';
import { connect } from 'react-redux';
import firebase from './firebase/firebase';
import ContactList from './components/ContactList';
import UpdateContact from './pages/ContactData/UpdateContact';

import SendEmail from './pages/SendEmail/SendEmail';
function App({ auth, dispatch }) {
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    loadGmailApi();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log('user', user.providerData);
        dispatch({ type: 'AUTH_USER', payload: user });
      }
    });
  }, []);

  // to load contact data at as soon as we have a user logged in
  if (auth.auth) {
    const contactCollection = firebase
      .firestore()
      .collection(`users/${auth.auth.uid}/contacts`);

    contactCollection.get().then((snapshot) => {
      const data = snapshot.docs.map((d) => d.data());
      // console.log('snapshot', data);
      dispatch({ type: 'GET_CONTACTS', payload: data });
    });
  }

  setTimeout(() => {
    setRedirect(true);
  }, 3000);

  return (
    <Router>
      <div className='App'>
        <Header />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/login'>
            <LoginPage />
          </Route>
          <Route path='/dashboard'>
            {auth.auth ? (
              <div className='main'>
                <Dashboard />
              </div>
            ) : (
              <div>
                {redirect ? <LoginPage /> : <div className='loader'></div>}
              </div>
            )}
          </Route>
          <Route path='/contact-data'>
            {auth.auth ? (
              <div className='main'>
                <ContactData />
              </div>
            ) : (
              <div>
                {redirect ? <LoginPage /> : <div className='loader'></div>}
              </div>
            )}
          </Route>
          <Route path='/update-contact'>
            {auth.auth ? (
              <div className='main'>
                <UpdateContact />
              </div>
            ) : (
              <div>
                {redirect ? <LoginPage /> : <div className='loader'></div>}
              </div>
            )}
          </Route>
          <Route path='/send'>
            {auth.auth ? (
              <SendEmail />
            ) : (
              <div>
                {redirect ? <LoginPage /> : <div className='loader'></div>}
              </div>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(App);
