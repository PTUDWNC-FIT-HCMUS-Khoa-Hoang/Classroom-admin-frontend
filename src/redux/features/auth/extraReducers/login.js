import loginThunk from '../thunks/login';
import STATUS from '../../../../constants/status';

const loginExtraReducers = {
  [loginThunk.pending]: (state) => {
    state.status = STATUS.LOADING;
  },
  [loginThunk.fulfilled]: (state, action) => {
    state.status = STATUS.SUCCESS;
    state.data = {
      userId: action.payload.user._id,
      fullname: action.payload.user.fullname,
      isActive: action.payload.user.isActive,
      isVerified: action.payload.user.isVerified,
    };
    state.token = action.payload.token;
    state.error = null;
  },
  [loginThunk.rejected]: (state, action) => {
    state.status = STATUS.ERROR;
    state.error = action.error;
  },
};

export default loginExtraReducers;
