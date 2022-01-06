import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Divider, message, Row, Tabs, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import accountApis from '../../../api/accounts';
import AddEditForm from '../../../components/features/accounts/AddEditForm';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import Breadcrumb from './Breadcrumb';
const { TabPane } = Tabs;
const { Title } = Typography;

export default function AccountEditPage() {
  // react-router hooks
  const history = useHistory();
  const params = useParams();
  const accountid = params.id;

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
      if (accountid) {
        try {
          const axiosResponse = await accountApis.getOneById(
            authRedux.token,
            accountid
          );
          const data = axiosResponse.data;
          setInformation(data);
        } catch (error) {
          message.error(parseErrorMessage(error));
        }
      }
    };
    getOne();
  }, [authRedux.token, accountid, tabIndex]);

  const onTabsChange = (key) => {
    setTabIndex(key);
  };

  // handle functions
  const handleSubmitEditForm = async (formValues) => {
    try {
      await accountApis.putOne(authRedux.token, information._id, formValues);
      message.success(`Successfully updated this account's information`);
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
          onClick={() => history.push('/accounts')}
        >
          Back to Account List
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
              </Tabs>
            </Row>
          </Row>
        </Row>
      </div>
    </>
  );
}
