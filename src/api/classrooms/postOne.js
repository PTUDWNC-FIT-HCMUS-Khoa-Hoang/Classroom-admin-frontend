import jwtAuthHeaderGenerator from '../../helpers/jwtAuthHeaderGenerator';
import rootApi from '../root';

const postOne = (token, classroomData) =>
  rootApi.post('/classrooms', classroomData, {
    headers: {
      Authorization: jwtAuthHeaderGenerator(token),
    },
  });

export default postOne;
