import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../../css/style.css';
import firebase from '../../../firebase/firebase';

function Header({ auth, dispatch }) {
  let history = useHistory();

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
    history.push('/');
  };

  return (
    <div className='nav'>
      {auth.auth ? (
        <div className='nav-list'>
          <a onClick={Logout}>Logout</a>
          <p className='float-r'>
            Welcome, {auth.auth.displayName}{' '}
            <span>
              <img width='30' height='30' src={auth.auth.photoURL} />
            </span>
            !
          </p>
          <button onClick={() => history.push('/dashboard')}>Dashboard</button>
          <button onClick={() => history.push('/send')}>Send an Email</button>
          <button onClick={() => history.push('/scanner')}>QR Scanner</button>
        </div>
      ) : (
        <div className='nav-list'>
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
