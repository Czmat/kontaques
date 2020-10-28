import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { loadGmailApi } from './gmail/Gmail';
import CreateContacts from './components/createContacts';
import ContactData from './pages/ContactData/ContactData';
import { connect } from 'react-redux';
import firebase from './firebase/firebase';

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

  setTimeout(() => {
    setRedirect(true);
  }, 3000);

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/dashboard">
            {auth.auth ? (
              <div>
                <Dashboard />
                <CreateContacts />
              </div>
            ) : (
              <div>
                {redirect ? <LoginPage /> : <div className="loader"></div>}
              </div>
            )}
          </Route>
          <Route path="/contact-data" component={ContactData} />
        </Switch>
      </div>
    </Router>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(App);
