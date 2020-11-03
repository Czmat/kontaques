import React, { useState } from 'react';
import styles from './ContactData.module.css';
import Input from '../../components/UI/Input/Input';
import { formConfig } from './form.config';
import checkValidity from './validationRules';
import firebase from '../../firebase/firebase';
import { connect } from 'react-redux';

function ContactData({ auth, contacts, dispatch }) {
  const [contactData, setContactData] = useState(formConfig);
  // console.log('contact data', contactData);

  function inputChangedHandler(event, inputIdentifier) {
    const updatedContactForm = {
      ...contactData.contactForm,
    };
    const updatedFormElement = {
      ...updatedContactForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;

    // add photo to contact data as photoFile
    const photoFile = event.target.files;
    if (photoFile && photoFile.length > 0) {
      console.log('e.file', event.target.files[0]);
      updatedFormElement.photoFile = photoFile[0];
    }

    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedContactForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedContactForm) {
      formIsValid = updatedContactForm[inputIdentifier].valid && formIsValid;
    }
    setContactData({
      contactForm: updatedContactForm,
      formIsValid: formIsValid,
    });
  }

  function contactSubmitHandler(e) {
    e.preventDefault();
    const contactForm = {};
    const addressKeys = ['street_address', 'city', 'state', 'zipCode'];
    const addressObj = {};
    const photoUrl = {};
    for (let formElementIdentifier in contactData.contactForm) {
      if (addressKeys.includes(formElementIdentifier)) {
        addressObj[formElementIdentifier] =
          contactData.contactForm[formElementIdentifier].value;
      } else if (formElementIdentifier === 'photoFile') {
        console.log(
          'form identifier should be photoFile ===',
          formElementIdentifier
        );
        const photoUpload =
          contactData.contactForm[formElementIdentifier].photoFile;
        console.log(
          'photo file',
          contactData.contactForm[formElementIdentifier].photoFile
        );
        if (photoUpload) {
          contactForm[formElementIdentifier] = photoUpload;
        }

        // // upload photo and get url
        // firebase
        //   .storage()
        //   .ref(photoUpload.name)
        //   .put(photoUpload)
        //   .then(function (snapshot) {
        //     console.log('Photo Uploaded!');
        //     firebase
        //       .storage()
        //       .ref(photoUpload.name)
        //       .getDownloadURL()
        //       .then((url) => {
        //         photoUrl.url = url;
        //         console.log('url is: ', url);
        //       });
        //   });
      } else {
        console.log('contact form', formElementIdentifier);
        contactForm[formElementIdentifier] =
          contactData.contactForm[formElementIdentifier].value;
      }
    }

    const handledFormData = {
      ...contactForm,
      address: addressObj,
    };
    // Post contactForm to firebase
    console.log(handledFormData);
    // calling create contact function on submit
    createContactInFirestore(handledFormData);
  }

  // firebase contact collection for signed in user
  const contactCollection = firebase
    .firestore()
    .collection(`users/${auth.auth.uid}/contacts`);
  // function to create contact
  const createContactInFirestore = (contactData) => {
    const photoFile = contactData.photoFile;
    if (!photoFile) {
      const ref = contactCollection.doc();
      ref.set({ ...contactData, id: ref.id }).then(() => {
        console.log('Contact has been created');
        contactCollection.get().then((snapshot) => {
          const data = snapshot.docs.map((d) => d.data());
          dispatch({ type: 'GET_CONTACTS', payload: data });
        });
      });
    } else {
      // upload photo and get url
      firebase
        .storage()
        .ref(photoFile.name)
        .put(photoFile)
        .then(function (snapshot) {
          console.log('Photo Uploaded!');
          firebase
            .storage()
            .ref(photoFile.name)
            .getDownloadURL()
            .then((url) => {
              console.log('url is: ', url);

              const ref = contactCollection.doc();
              //update contact data with photo url and id using fb id
              const updatedContactData = {
                ...contactData,
                id: ref.id,
                photoFile: url,
              };

              ref.set(updatedContactData).then(() => {
                console.log('Contact has been created');
                contactCollection.get().then((snapshot) => {
                  const data = snapshot.docs.map((d) => d.data());
                  dispatch({ type: 'GET_CONTACTS', payload: data });
                });
              });
              setContactData(formConfig);
            });
        });
    }
  };

  const formElementsArray = [];
  for (let key in contactData.contactForm) {
    formElementsArray.push({
      id: key,
      config: contactData.contactForm[key],
    });
  }

  let form = (
    <form onSubmit={contactSubmitHandler}>
      {formElementsArray.map((formElement) => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={(event) => inputChangedHandler(event, formElement.id)}
          error={formElement.config.errorMsg}
        />
      ))}
      <button disabled={!contactData.formIsValid}>Add Contact</button>
    </form>
  );
  return (
    <div className={styles.ContactData}>
      <h4>Enter you Contact Data</h4>
      {form}
      <h4>My contacts</h4>
      <ul>
        {contacts.contacts.map((contact) => {
          return (
            <div>
              <li key={contact.id}>{contact.firstName}</li>
              {contact.photoFile ? (
                <img src={contact.photoFile} alt={contact.photoFile} />
              ) : (
                'no photo'
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
});

export default connect(mapStateToProps)(ContactData);
