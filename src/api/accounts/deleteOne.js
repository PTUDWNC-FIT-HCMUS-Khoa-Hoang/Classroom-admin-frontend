import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';
import END_POINT from './endpoint';

const deleteOne = (token, id) =>
    rootApi.delete(`/${END_POINT}/${id}`, {
        headers: {
            Authorization: jwtAuthHeaderGenerator(token),
        },
    });

export default deleteOne;
