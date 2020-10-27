import React, { useState } from "react";
import styles from "./ContactData.module.css";
import Input from "../../components/UI/Input/Input";

function ContactData() {
  const [contactData, setContactData] = useState({
    contactForm: {
      firstName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "First Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMsg: "Please enter a first name",
      },
      lastName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Last Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMsg: "Please enter a last name",
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
        errorMsg: "Please enter an email.",
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Zip",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
          isNumeric: true,
        },
        valid: false,
        touched: false,
        errorMsg: "Please enter a 5 digit numeric zip code",
      },
      telephone: {
        elementType: "input",
        elementConfig: {
          type: "tel",
          placeholder: "123-456-7890",
        },
        value: "",
        validation: {
          required: true,
          isPhone: true,
        },
        valid: false,
        touched: false,
        errorMsg: "Please enter a 10 digit numeric phone number",
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "Enter some notes..",
        },
        value: "",
        validation: {
          required: false,
        },
        valid: false,
        touched: false,
        errorMsg: "Please enter an email.",
      },
    },
    formIsValid: false,
  });

  function checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }
    if (rules.isPhone) {
      const pattern = /(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}/;
      const trimmedValue = value.replace(/[^\d]/g, "");
      isValid = pattern.test(value) && trimmedValue.length === 10 && isValid;
    }
    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
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
    for (let formElementIdentifier in contactData.contactForm) {
      contactForm[formElementIdentifier] =
        contactData.contactForm[formElementIdentifier].value;
    }
    // Post contactForm to firebase
    console.log(contactForm);
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
