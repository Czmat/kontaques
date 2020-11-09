import React from 'react';
// import styles from '../pages/ContactData/ContactData.module.css';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import styles from './ContactList.module.css';

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

  const isChecked = (id) => {
    return contacts.selectedContacts.some((selectedContact) => {
      return selectedContact.id === id;
    });
  };

  return (
    <div className={styles.Contacts}>
      <h4>My contacts</h4>
      <ul className={styles.ContactList}>
        <div>
          {contacts.contacts.map((contact, i) => {
            return (
              <div className={styles.formGroup} key={i}>
                <input
                  type='checkbox'
                  name='check'
                  onChange={(e) => addContact(e, contact)}
                  checked={isChecked(contact.id)}
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
  // selected: state.contacts.selectedContacts,
});

export default connect(mapStateToProps)(ContactList);
