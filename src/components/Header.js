import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../css/style.css';

function Header({ auth, dispatch }) {
  let history = useHistory();
  const Login = () => {
    history.push('/login');
  };
  const Logout = () => {
    dispatch({ type: 'AUTH_USER', payload: false });
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
