import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';
import END_POINT from './endpoint';

const getOne = (token, id) =>
    rootApi.get(`/${END_POINT}/${id}`, {
        headers: {
            Authorization: jwtAuthHeaderGenerator(token),
        },
    });

export default getOne;
