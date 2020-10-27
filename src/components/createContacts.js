import React, { useState } from 'react';
import { connect } from 'react-redux';
import firebase from '../firebase/firebase';

const CreateContacts = ({ contacts, auth, dispatch }) => {
  console.log('auth', auth.auth.uid);
  const [contact, setContact] = useState({
    firstName: '',
    lastname: '',
    imgUrl: '',
    email: '',
    phone: '',
    occupation: '',
    discriptionNote: '',
    address: '',
  });

  const onChange = (e) => {
    setContact({ ...contact, firstName: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_CONTACT', payload: contact });
  };

  const createContactInFirestore = () => {
    const contactCollection = firebase.firestore().collection('contacts');
    // const contact
  };

  // console.log('contacts from redux', contacts.contacts);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={contact.firstName} onChange={onChange}></input>
        <button>Create Contact</button>
      </form>
      <ul>
        {contacts.contacts.map((contact) => {
          return <li key={contact.firstName + 1}>{contact.firstName}</li>;
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
});
export default connect(mapStateToProps)(CreateContacts);
