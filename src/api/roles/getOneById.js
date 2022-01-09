import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';

const getOne = (token, roleId) =>
    rootApi.get(`/roles/${roleId}`, {
        headers: {
            Authorization: jwtAuthHeaderGenerator(token),
        },
    });

export default getOne;
