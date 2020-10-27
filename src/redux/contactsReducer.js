export default (state = { contacts: [] }, action) => {
  switch (action.type) {
    case 'CREATE_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'GET_CONTACTS':
      return (state = { contacts: action.payload });
    default:
      return state;
  }
};
