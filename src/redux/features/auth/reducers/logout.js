import initialState from '../initialState';

const logoutReducer = (state) => {
  state.status = initialState.status;
  state.data = initialState.data;
  state.token = initialState.token;
  state.error = initialState.error;
};

export default logoutReducer;
