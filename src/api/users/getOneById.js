import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';

const getOneById = (token, userId) =>
  rootApi.get(`/users/${userId}`, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default getOneById;
