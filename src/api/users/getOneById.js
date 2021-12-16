import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';

const getOneById = (token, userId) =>
  rootApi.get(`/users/other/${userId}`, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default getOneById;
