import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import '../css/style.css';
import styles from './Header.module.css';
import firebase from '../../../firebase/firebase';

function Header({ auth, dispatch }) {
  const [showModal, setShowModal] = useState(false);
  let history = useHistory();

  const Login = () => {
    history.push('/login');
  };

  const goTo = (page) => {
    history.push('/' + page);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
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
      {showModal ? (
        <div>
          <div onClick={toggleModal} className={styles.backdrop}></div>
          <nav className={styles.mobile_nav}>
            <ul className={styles.mobile_nav__items}>
              <li className={styles.mobile_nav__item}>
                <a
                  onClick={() => {
                    goTo('dashboard');
                    toggleModal();
                  }}
                >
                  Dashboard
                </a>
              </li>
              <li className={styles.mobile_nav__item}>
                <a
                  onClick={() => {
                    goTo('send');
                    toggleModal();
                  }}
                >
                  Send an Email
                </a>
              </li>
              <li className={styles.mobile_nav__item}>
                <a
                  onClick={() => {
                    Logout();
                    toggleModal();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}

      {auth.auth ? (
        <div>
          <div className={styles.main_header__welcome}>
            <button className={styles.toggle_button} onClick={toggleModal}>
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
        <h1
          style={{
            textAlign: 'center',
            color: 'white',
            minHeight: '3rem',
          }}
        >
          <span>Spinspire CRM</span>
        </h1>
      )}
    </header>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Header);
