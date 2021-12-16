import rootApi from '../root';

const register = (fullname, email, password) =>
  rootApi.post('/account/register', {
    fullname,
    email,
    password,
  });

export default register;
