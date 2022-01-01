import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';
import END_POINT from './endpoint';

const putOne = (token, id, newData) =>
    rootApi.put(`/${END_POINT}/${id}`, newData, {
        headers: {
            Authorization: jwtAuthHeaderGenerator(token),
        },
    });

export default putOne;
