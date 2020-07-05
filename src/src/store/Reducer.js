export const initialState = {
  user: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "set":
      return { ...state, ...action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
};
