import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  Result,
  Tabs,
  Typography,
  Row,
  Col,
  Space,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { useHistory, useParams } from 'react-router';
import userApis from '../../../api/users';
import Breadcrumb from './Breadcrumb';
import AddEditForm from '../../../components/features/Users/AddEditForm';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import { useHistory, useParams } from 'react-router-dom';
// import { useFunctionalitiesRedux } from '~/hooks';
const { TabPane } = Tabs;
const { Title } = Typography;

export default function UserEditPage() {
  // // react-router hooks
  const history = useHistory();
  const params = useParams();
  const userId = params.id;

  // Functionality hook
  // const { checkFunctionality, functionalityList } = useFunctionalitiesRedux();

  // states
  const [tabIndex, setTabIndex] = useState(1);
  const [information, setInformation] = useState(null);
  // Redux hooks
  const authRedux = useSelector((state) => state.auth);
  // side effects
  useEffect(() => {
    const getOneUser = async () => {
      if (userId) {
        try {
          const axiosResponse = await userApis.getOneById(
            authRedux.token,
            userId
          );
          const userData = axiosResponse.data;
          setInformation(userData);
        } catch (error) {
          message.error(parseErrorMessage(error));
        }
      }
    };
    getOneUser();
  }, [authRedux.token, userId, tabIndex]);

  const onTabsChange = (key) => {
    setTabIndex(key);
  };

  // handle functions
  const handleSubmitEditForm = async (formValues) => {
    try {
      await userApis.putOne(authRedux.token, information._id, formValues);
      message.success(`Successfully updated this user's information`);
    } catch (error) {
      message.error(parseErrorMessage(error));
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/users')}
        >
          Back to Users List
        </Button>

        <Divider />

        <Row justify="center">
          <Row className="card">
            <Row style={{ width: '100%' }} justify="center">
              <Col span={24}>
                <Title level={2} style={{ textAlign: 'center' }}>
                  {information?.fullname || 'Anonymous'}
                </Title>
              </Col>
              <Col span={24}>
                <Title level={3} style={{ textAlign: 'center' }}>
                  #{information?._id || 'ID'}
                </Title>
              </Col>
            </Row>
            <Row className="card-body">
              <Tabs defaultActiveKey="1" onChange={onTabsChange}>
                <TabPane tab="Information" key="1">
                  {information ? (
                    <AddEditForm
                      information={information}
                      onAsyncSubmit={handleSubmitEditForm}
                    />
                  ) : null}
                </TabPane>
                {/* <TabPane tab="Purchase History" key="2">
                  <Result
                    status="warning"
                    title="You are not allowed to change any purchase history of users."
                  />
                </TabPane> */}
              </Tabs>
            </Row>
          </Row>
        </Row>
      </div>
    </>
  );
}
