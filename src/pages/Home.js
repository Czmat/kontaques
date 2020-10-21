import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
  useHistory,
} from 'react-router-dom';

function Home({ auth }) {
  const history = useHistory();
  console.log('home page', auth);
  function goToLogin() {
    history.push(`/login`);
  }

  function goToDashboard() {
    history.push(`/dashboard`);
  }
  return (
    <>
      <div>This is the public page</div>
      <button onClick={goToLogin}>Go to Login</button>
      <button onClick={goToDashboard}>Go to Dashboard</button>
    </>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Home);
