import React, { useState } from 'react';
import styles from '../pages/ContactData/ContactData.module.css';
import { connect } from 'react-redux';

const ContactList = ({ auth, contacts, dispatch }) => {
  const addContact = (e, contactData) => {
    if (e.target.checked === true) {
      dispatch({ type: 'SELECT_CONTACT', payload: contactData });
    } else {
      const filteredContacts = contacts.selectedContacts.filter(
        (contact) => contact.id !== contactData.id
      );
      dispatch({ type: 'UNSELECT_CONTACT', payload: filteredContacts });
    }
  };

  return (
    <div className={styles.ContactData}>
      <h4>My contacts</h4>
      <ul>
        <div>
          {contacts.contacts.map((contact) => {
            return (
              <div>
                <input
                  style={{ display: 'inline-block' }}
                  type="checkbox"
                  name="check"
                  onChange={(e) => addContact(e, contact)}
                />
                {'  '}
                <li style={{ display: 'inline-block' }} key={contact.id}>
                  {contact.firstName}
                </li>
              </div>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
});

export default connect(mapStateToProps)(ContactList);
