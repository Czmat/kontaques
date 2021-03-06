import React, { useEffect, useState } from 'react';
import styles from './ContactData.module.css';
import Input from '../../components/UI/Input/Input';
import { formConfig } from './form.config';
import checkValidity from './validationRules';
import firebase from '../../firebase/firebase';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import statesArr from './states.partial';

function ContactData({ auth, updateContact, dispatch }) {
  const [contactData, setContactData] = useState(formConfig);

  // if updateContact is true setContactData with updateFormConfig
  useEffect(() => {
    // UPDATE FORM CONFIG for QR contact
    if (updateContact) {
      const updateFormConfig = {
        contactForm: {
          firstName: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'First Name',
            },
            value: updateContact.firstName,
            validation: {
              required: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter a first name',
          },
          lastName: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'Last Name',
            },
            value: updateContact.lastName,
            validation: {
              required: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter a last name',
          },
          telephone: {
            elementType: 'input',
            elementConfig: {
              type: 'tel',
              placeholder: '123-456-7890',
            },
            value: updateContact.telephone,
            validation: {
              required: true,
              isPhone: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter a 10 digit numeric phone number',
          },
          email: {
            elementType: 'input',
            elementConfig: {
              type: 'email',
              placeholder: 'Email',
            },
            value: updateContact.email,
            validation: {
              required: true,
              isEmail: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter an email.',
          },
          occupation: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'Occupation',
            },
            value: updateContact.occupation,
            validation: {
              required: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter an occupation',
          },
          street_address: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'Street Address',
            },
            value: updateContact ? updateContact.address.street_address : '',
            validation: {
              required: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter your street address.',
          },
          city: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'City',
            },
            value: updateContact ? updateContact.address.city : '',
            validation: {
              required: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter a city',
          },
          state: {
            elementType: 'select',
            elementConfig: {
              options: statesArr,
            },
            value: updateContact ? updateContact.address.state : '',
            validation: {},
            valid: true,
          },
          zipCode: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'Zip',
            },
            value: updateContact ? updateContact.address.zipCode : '',
            validation: {
              required: true,
              minLength: 5,
              maxLength: 5,
              isNumeric: true,
            },
            valid: true,
            touched: false,
            errorMsg: 'Please enter a 5 digit numeric zip code',
          },
          description: {
            elementType: 'textarea',
            elementConfig: {
              type: 'text',
              placeholder: 'Enter some notes..',
            },
            value: updateContact.description,
            validation: {
              required: false,
            },
            valid: true,
            touched: false,
          },
          photoFile: {
            elementType: 'input',
            elementConfig: {
              type: 'file',
              accept: 'image/*',
            },
            value: '',
            validation: {
              required: false,
            },
            valid: true,
            touched: false,
          },
        },
        formIsValid: false,
      };
      setContactData(updateFormConfig);
    }
  }, [updateContact]);

  // redirect dashboard
  let history = useHistory();

  function goToDashboard() {
    history.push(`/dashboard`);
  }

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
      let renamedPhoto = photoFile[0];
      // change name in file object before adding to store
      // so that no duplicate names in firebase storage
      Object.defineProperty(renamedPhoto, 'name', {
        writable: true,
        value: renamedPhoto.name + Date.now(),
      });
      updatedFormElement.photoFile = renamedPhoto;
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
  const storage = firebase.storage();
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
          setContactData(formConfig);
          dispatch({ type: 'UPDATE_CONTACT', payload: '' });
          goToDashboard();
        });
      });
    } else {
      // upload photo and get url
      storage
        .ref(photoFile.name)
        .put(photoFile)
        .then(function (snapshot) {
          console.log('Photo Uploaded!');
          storage
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
              dispatch({ type: 'UPDATE_CONTACT', payload: '' });
              goToDashboard();
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
      <button
        className={styles.submitButton}
        disabled={!contactData.formIsValid}
      >
        Add Contact
      </button>
    </form>
  );
  return (
    <div className={styles.ContactData}>
      <h4>Enter you Contact Data</h4>
      {form}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
  updateContact: state.contacts.updateContact,
});

export default connect(mapStateToProps)(ContactData);
