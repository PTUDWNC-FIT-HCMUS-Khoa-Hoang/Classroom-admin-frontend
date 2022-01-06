import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';
import END_POINT from './endpoint';

const postOne = (token, newData) =>
  rootApi.post(`/${END_POINT}/add`, newData, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default postOne;
