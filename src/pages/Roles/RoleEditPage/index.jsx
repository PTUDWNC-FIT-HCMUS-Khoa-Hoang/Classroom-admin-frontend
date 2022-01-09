import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Divider, message, Row, Tabs, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
// import { useHistory, useParams } from 'react-router';
import roleApis from '../../../api/roles';
import AddEditForm from '../../../components/features/roles/AddEditForm';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import Breadcrumb from './Breadcrumb';
// import { useFunctionalitiesRedux } from '~/hooks';
const { TabPane } = Tabs;
const { Title } = Typography;

export default function RoleEditPage() {
  // // react-router hooks
  const history = useHistory();
  const params = useParams();
  const roleId = params.id;

  // Functionality hook
  // const { checkFunctionality, functionalityList } = useFunctionalitiesRedux();

  // states
  const [tabIndex, setTabIndex] = useState(1);
  const [information, setInformation] = useState(null);
  // Redux hooks
  const authRedux = useSelector((state) => state.auth);
  // side effects
  useEffect(() => {
    const getOne = async () => {
      if (roleId) {
        try {
          const axiosResponse = await roleApis.getOneById(
            authRedux.token,
            roleId
          );
          const data = axiosResponse.data;
          setInformation(data);
        } catch (error) {
          message.error(parseErrorMessage(error));
        }
      }
    };
    getOne();
  }, [authRedux.token, roleId, tabIndex]);

  const onTabsChange = (key) => {
    setTabIndex(key);
  };

  // handle functions
  const handleSubmitEditForm = async (formValues) => {
    try {
      await roleApis.putOne(authRedux.token, information._id, formValues);
      message.success(`Successfully updated this role's information`);
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
          onClick={() => history.push('/roles')}
        >
          Back to Role List
        </Button>

        <Divider />

        <Row justify="center">
          <Row className="card">
            <Row style={{ width: '100%' }} justify="center">
              <Col span={24}>
                <Title level={2} style={{ textAlign: 'center' }}>
                  {information?.title || 'Anonymous'}
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
