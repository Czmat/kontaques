import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

function LoginPage({ auth, dispatch }) {
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    if (auth.auth) {
      history.push('/dashboard');
    }
  }, []);

  function loginHandler() {
    dispatch({ type: 'AUTH_USER', payload: true });
    history.push('/dashboard');
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
