import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import '../css/style.css';
import styles from './Header.module.css';
import firebase from '../../../firebase/firebase';

function Header({ auth, dispatch }) {
  let history = useHistory();

  const Login = () => {
    history.push('/login');
  };

  const goTo = (page) => {
    history.push('/' + page);
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
    <header className={styles.main_header}>
      {auth.auth ? (
        <div>
          <div className={styles.main_header__welcome}>
            <button className={styles.toggle_button}>
              <span className={styles.toggle_button__bar}></span>
              <span className={styles.toggle_button__bar}></span>
              <span className={styles.toggle_button__bar}></span>
            </button>
            <div
              className={styles.main_header__img}
              style={{
                backgroundImage: `url(${auth.auth.photoURL})`,
              }}
            ></div>
            <span>Welcome, {auth.auth.displayName} !</span>
          </div>
          <nav className={styles.main_nav}>
            <ul className={styles.main_nav__items}>
              <li className={styles.main_nav__item}>
                <a onClick={() => goTo('dashboard')}>Dashboard</a>
              </li>
              <li className={styles.main_nav__item}>
                <a onClick={() => goTo('send')}>Send an Email</a>
              </li>
              <li className={styles.main_nav__item}>
                <a onClick={Logout}>Logout</a>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <nav className={styles.main_nav}>
          <a onClick={Login}>Login</a>
        </nav>
      )}
    </header>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Header);
