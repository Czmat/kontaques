import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import firebase from '../firebase/firebase';

const initial_contact = {
  firstName: '',
  lastname: '',
  imgUrl: '',
  email: '',
  phone: '',
  occupation: '',
  discriptionNote: '',
  address: '',
};

const CreateContacts = ({ contacts, auth, dispatch }) => {
  // console.log('auth', auth.auth.uid);
  const [contact, setContact] = useState(initial_contact);

  useEffect(() => {
    contactCollection.get().then((snapshot) => {
      const data = snapshot.docs.map((d) => d.data());
      console.log('snapshot', data);
      dispatch({ type: 'GET_CONTACTS', payload: data });
    });
  }, []);

  const contactCollection = firebase
    .firestore()
    .collection(`users/${auth.auth.uid}/contacts`);

  const onChange = (e) => {
    setContact({ ...contact, firstName: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // dispatch({ type: 'CREATE_CONTACT', payload: contact });
    createContactInFirestore();
  };

  const createContactInFirestore = () => {
    if (!contact.imgUrl) {
      contactCollection
        .doc()
        .set({ ...contact, id: contactCollection.doc().id })
        .then(() => {
          console.log('Contact has been created');
          setContact(initial_contact);
          contactCollection.get().then((snapshot) => {
            const data = snapshot.docs.map((d) => d.data());
            // console.log('snapshot', data)
            dispatch({ type: 'GET_CONTACTS', payload: data });
          });
        });
    }
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
          return <li key={contact.id}>{contact.firstName}</li>;
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
