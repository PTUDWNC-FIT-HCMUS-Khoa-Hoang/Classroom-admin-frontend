import { Breadcrumb, Col, Divider, message, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classroomApis from '../../api/classrooms';
import userApis from '../../api/users';
import ClassroomAdd from '../../components/pages/Classrooms/ClassroomAdd';
import ClassroomCard from '../../components/pages/Classrooms/ClassroomCard';
import STATUS from '../../constants/status';
import filterDuplicatedFields from '../../helpers/filterDuplicatedFields';
import parseErrorMessage from '../../helpers/parseErrorMessage';

export default function ClassroomList() {
  //#region redux hooks
  const auth = useSelector((state) => state.auth);
  //#endregion

  //#region constants

  //#endregion

  //#region useState (classrooms, status)
  const [classrooms, setClassrooms] = useState([
    {
      _id: 'a1',
      title: 'Web Basic',
      owner: 'Khoa Tran',
      createdAt: '2021-10-21T14:37:45.158Z',
    },
  ]);

  const [status, setStatus] = useState(STATUS.IDLE);
  //#endregion

  //#region useEffect (getAllClassrooms)
  useEffect(() => {
    const getAllOwnedClassrooms = async () => {
      setStatus(STATUS.LOADING);

      try {
        const axiosRes = await classroomApis.getAllOwned(auth.token);
        const classrooms = axiosRes.data;

        const ownerIds = filterDuplicatedFields({
          arr: classrooms,
          fieldName: 'owner',
        });

        const owners = [];

        for await (const ownerId of ownerIds) {
          const axiosRes = await userApis.getOneById(auth.token, ownerId);
          const { fullname } = axiosRes.data;
          owners.push({
            _id: ownerId,
            fullname,
          });
        }

        const classroomsWithOwner = classrooms.map((classroom) => {
          return {
            ...classroom,
            owner: owners.find((owner) => owner._id === classroom.owner),
          };
        });

        setClassrooms(classroomsWithOwner);
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        message.error(parseErrorMessage(error));
        setStatus(STATUS.ERROR);
      }
    };

    getAllOwnedClassrooms();

    // setCourses([
    //   {
    //     _id: 'a1',
    //     title: 'Web Basic',
    //     owner: 'Khoa Tran',
    //     createdAt: '2021-10-21T14:37:45.158Z',
    //   },
    //   {
    //     _id: 'a2',
    //     title: 'Web Advance',
    //     owner: 'Khoa Le',
    //     createdAt: '2021-10-21T14:37:45.158Z',
    //   },
    //   {
    //     _id: 'a3',
    //     title: 'Mobile Basic',
    //     owner: 'Khoa Nguyen',
    //     createdAt: '2021-10-21T14:37:45.158Z',
    //   },
    // ]);
  }, [auth.token]);
  //#endregion

  //#region handle functions
  const handleClassroomAddComplete = async (newClassroom) => {
    setStatus(STATUS.LOADING);

    try {
      const axiosRes = await userApis.getOneById(
        auth.token,
        newClassroom.owner
      );
      const ownerData = axiosRes.data;
      const owner = {
        fullname: ownerData.fullname,
        _id: newClassroom.owner,
      };
      const newClassroomWithOwner = {
        ...newClassroom,
        owner,
      };
      setClassrooms([...classrooms, newClassroomWithOwner]);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      message.error(
        `There was an error with getting newly created classroom's owner information.` +
          parseErrorMessage(error)
      );
    }
  };
  //#endregion

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Courses</Breadcrumb.Item>
      </Breadcrumb>
      <Row justify="end">
        <ClassroomAdd onAddComplete={handleClassroomAddComplete} />
      </Row>
      <Divider />
      <Spin spinning={status === STATUS.LOADING}>
        <Row gutter={[16, 24]}>
          {classrooms.map((classroom) => (
            <Col key={classroom._id}>
              <ClassroomCard classroom={classroom} />
            </Col>
          ))}
        </Row>
      </Spin>
    </>
  );
}
