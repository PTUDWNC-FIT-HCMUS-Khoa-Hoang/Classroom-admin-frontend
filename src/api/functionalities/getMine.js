import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';

const getMine = (token) =>
    rootApi.get(`/functionalities/mine`, {
        headers: {
            Authorization: jwtAuthHeaderGenerator(token),
        },
    });

export default getMine;
