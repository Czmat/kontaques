import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
  useHistory,
} from 'react-router-dom';
import '../../App.css';
import styles from './Home.module.css';

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
    <main className='main'>
      <h1 className={styles.home_title}>This is the public page</h1>
      <div className={styles.home}>
        <button onClick={goToLogin}>Login</button>
        <button onClick={goToDashboard}>Dashboard</button>
      </div>
    </main>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Home);
