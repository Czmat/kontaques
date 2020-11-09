import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContactList from '../../components/ContactList';
import '../../App.css';
import '../../css/style.css';
import styles from './Dashboard.module.css';

function Dashboard({ auth }) {
  let history = useHistory();
  // console.log(auth.auth);

  function goToContactData() {
    history.push(`/contact-data`);
  }

  if (auth.auth == null) {
    setTimeout(() => {
      history.push('/login');
    }, 1000);
  }
  return (
    <div>
      {auth.auth ? (
        <div className={styles.dashboard}>
          <div>
            <button className='button' onClick={goToContactData}>
              Create Contact
            </button>
          </div>
          <div>
            <ContactList />
          </div>
        </div>
      ) : (
        <div className='display-i-b'>
          <div className='loader'></div>Redirecting to login
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Dashboard);
