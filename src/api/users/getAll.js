import rootApi from '../root';
import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import parseUrlQueryParams from '../../helpers/queries/parseUrlQueryParams';
import END_POINT from './endpoint';

const getAll = (token, options) =>
  rootApi.get(`/${END_POINT}${parseUrlQueryParams(options)}`, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default getAll;
