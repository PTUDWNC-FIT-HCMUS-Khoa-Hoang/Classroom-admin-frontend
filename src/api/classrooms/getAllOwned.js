import rootApi from '../root';
import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';

const getAllOwned = (token) =>
  rootApi.get('/classrooms/owned', {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default getAllOwned;
