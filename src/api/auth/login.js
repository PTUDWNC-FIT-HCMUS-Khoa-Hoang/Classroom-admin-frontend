import rootApi from '../root';

const login = (email, password) =>
  rootApi.post('/accounts/login', {
    email,
    password,
  });

export default login;
