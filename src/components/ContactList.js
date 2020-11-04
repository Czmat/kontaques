import React from 'react';
import styles from '../pages/ContactData/ContactData.module.css';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

const ContactList = ({ updateContact, contacts, dispatch }) => {
  let history = useHistory();

  function goToUpdateContact() {
    history.push(`/update-contact`);
  }

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

  const editContact = (contactToUpdate) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: contactToUpdate });
    goToUpdateContact();
  };

  return (
    <div className={styles.ContactData}>
      <h4>My contacts</h4>
      <ul>
        <div>
          {contacts.contacts.map((contact, i) => {
            return (
              <div key={i}>
                <input
                  style={{ display: 'inline-block' }}
                  type="checkbox"
                  name="check"
                  onChange={(e) => addContact(e, contact)}
                />
                {'    '}
                <li style={{ display: 'inline-block' }} key={contact.id}>
                  {contact.firstName}
                </li>
                {'    '}
                {contact.photoFile ? (
                  <img src={contact.photoFile} alt={contact.photoFile} />
                ) : (
                  'no photo'
                )}
                {'    '}
                <button onClick={(e) => editContact(contact)}>Update</button>
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
  updateContact: state.contacts.updateContact,
});

export default connect(mapStateToProps)(ContactList);
