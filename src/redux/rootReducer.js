import { combineReducers } from 'redux';
// reducers
import authReducer from './features/auth/slice';
// persist configs
// import authPersistConfig from './features/auth/persistConfig';

const rootReducer = combineReducers({
  // auth: persistReducer(authPersistConfig, authReducer),
  auth: authReducer,
});

export default rootReducer;
