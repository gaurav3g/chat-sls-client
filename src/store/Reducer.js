export const initialState = {
  user: {},
  loginModalOpen: false,
  wsClient: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "set":
      if (action.stype)
        return {
          ...state,
          [action.stype]: { ...state[action.stype], ...action.value },
        };
      else return { ...state, ...action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
};
