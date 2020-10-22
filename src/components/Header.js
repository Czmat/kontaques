import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../css/style.css';
import firebase from '../firebase/firebase';

function Header({ auth, dispatch }) {
  let history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: 'AUTH_USER', payload: user });
      }
    });
  }, []);

  const Login = () => {
    history.push('/login');
  };

  const Logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: 'AUTH_USER', payload: null });
      });
  };
  return (
    <div className="nav">
      {auth.auth ? (
        <div className="nav-list">
          <a onClick={Logout}>Logout</a>
          <p className="float-r">Welcome, User!</p>
        </div>
      ) : (
        <div className="nav-list">
          <a onClick={Login}>Login</a>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Header);
