export default (state = { contacts: [], selectedContacts: [] }, action) => {
  switch (action.type) {
    case 'CREATE_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'GET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'SELECT_CONTACT':
      return {
        ...state,
        selectedContacts: [...state.selectedContacts, action.payload],
      };
    case 'UNSELECT_CONTACT':
      return {
        ...state,
        selectedContacts: action.payload,
      };
    default:
      return state;
  }
};
