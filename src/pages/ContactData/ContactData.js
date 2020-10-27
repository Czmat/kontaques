import React, { useState } from 'react';
import styles from './ContactData.module.css';
import Input from '../../components/UI/Input/Input';
import formConfig from './form.config';
import checkValidity from './validationRules';

function ContactData() {
  const [contactData, setContactData] = useState(formConfig);

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
    console.log(handledFormData);
  }

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
    </div>
  );
}

export default ContactData;
