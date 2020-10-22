export default (state = { auth: false }, action) => {
  switch (action.type) {
    case 'AUTH_USER':
      return {
        ...state,
        auth: action.payload,
      };
    default:
  }
  return state;
};
