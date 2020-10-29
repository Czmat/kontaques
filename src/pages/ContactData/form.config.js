import statesArr from './states.partial';

const formConfig = {
  contactForm: {
    firstName: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'First Name',
      },
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
      validation: {},
      valid: true,
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Zip',
      },
      value: '',
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

export { formConfig };
