import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';
import END_POINT from './endpoint';

const getOneById = (token, userId) =>
  rootApi.get(`/${END_POINT}/other/${userId}`, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default getOneById;
