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
    <>
      {contacts.contacts.length > 0 ? (
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
                    {contact.photoFile ? (
                      <div
                        className={styles.contact_image}
                        style={{ backgroundImage: `url(${contact.photoFile})` }}
                      ></div>
                    ) : (
                      <div
                        className={styles.contact_image}
                        style={{ display: 'invisible' }}
                      ></div>
                    )}
                    {'    '}
                    <li key={contact.id}>{contact.firstName}</li>
                    <li key={contact.id}>{contact.lastName}</li>
                    {'    '}
                    <button onClick={(e) => editContact(contact)}>
                      Update
                    </button>
                  </div>
                );
              })}
            </div>
          </ul>
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
  updateContact: state.contacts.updateContact,
  // selected: state.contacts.selectedContacts,
});

export default connect(mapStateToProps)(ContactList);
