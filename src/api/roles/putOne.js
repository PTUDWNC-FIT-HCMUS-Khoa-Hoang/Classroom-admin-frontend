import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';

const putOne = (token, roleId, newRoleData) =>
    rootApi.put(`/roles/${roleId}`, newRoleData, {
        headers: {
            Authorization: jwtAuthHeaderGenerator(token),
        },
    });

export default putOne;
