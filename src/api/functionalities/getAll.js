import rootApi from '../root';
import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import parseUrlQueryParams from '../../helpers/queries/parseUrlQueryParams';

const getAll = (token, options) =>
  rootApi.get(`/functionalities${parseUrlQueryParams(options)}`, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default getAll;
