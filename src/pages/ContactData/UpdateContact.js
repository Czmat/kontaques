import React, { useEffect, useState } from 'react';
import styles from './ContactData.module.css';
import Input from '../../components/UI/Input/Input';
import statesArr from './states.partial';
import checkValidity from './validationRules';
import firebase from '../../firebase/firebase';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

function UpdateContact({ auth, updateContact, dispatch }) {
  //this object is in here because I dont have time to figure out how to import redux state into config
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
    },
    formIsValid: false,
  };
  const [contactData, setContactData] = useState({});
  useEffect(() => {
    setContactData(updateFormConfig);
  }, [updateContact]);

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
      } else {
        contactForm[formElementIdentifier] =
          contactData.contactForm[formElementIdentifier].value;
      }
    }

    const handledFormData = {
      ...contactForm,
      address: addressObj,
    };
    // Post contactForm to firebase
    // console.log('form', handledFormData);
    // calling update contact function on submit
    updateContactInFirestore(handledFormData);
  }

  // firebase contact collection for signed in user
  const contactCollection = firebase
    .firestore()
    .collection(`users/${auth.auth.uid}/contacts`);

  // function to update contact
  const updateContactInFirestore = (contactDataToUpdate) => {
    if (!contactData.imgUrl) {
      contactCollection
        .doc(updateContact.id)
        .set({ ...contactDataToUpdate, id: updateContact.id })
        .then(() => {
          console.log('Contact has been updated');
          contactCollection.get().then((snapshot) => {
            const data = snapshot.docs.map((d) => d.data());
            dispatch({ type: 'GET_CONTACTS', payload: data });
            goToDashboard();
          });
        });
    }
  };
  const deleteContact = () => {
    console.log('delete button');
    contactCollection
      .doc(updateContact.id)
      .delete()
      .then(function () {
        console.log('You are deleted!');
      });
    contactCollection.get().then((snapshot) => {
      const data = snapshot.docs.map((d) => d.data());
      dispatch({ type: 'GET_CONTACTS', payload: data });
      goToDashboard();
    });
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
      <button disabled={contactData.formIsValid}>Update Contact</button>
    </form>
  );
  return (
    <div className={styles.ContactData}>
      <h4>Enter you Contact Data</h4>
      {form}
      <button onClick={deleteContact}>Delete</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
  updateContact: state.contacts.updateContact,
});

export default connect(mapStateToProps)(UpdateContact);
