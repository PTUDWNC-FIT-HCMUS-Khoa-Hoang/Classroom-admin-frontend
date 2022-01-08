import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  Tabs,
  Typography,
  Row,
  Col,
  Card,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classroomApis from '../../../api/classrooms';
import Breadcrumb from './Breadcrumb';
import DetailInformation from './DetailInformation';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import { useHistory, useParams } from 'react-router-dom';

const { TabPane } = Tabs;
const { Title } = Typography;

export default function ClassroomViewPage() {
  // react-router hooks
  const history = useHistory();
  const params = useParams();
  const classroomId = params.id;
  // states
  const [tabIndex, setTabIndex] = useState(1);
  const [information, setInformation] = useState(null);
  // Redux hooks
  const authRedux = useSelector((state) => state.auth);
  // side effects
  useEffect(() => {
    const getOne = async () => {
      try {
        if (classroomId) {
          //get information
          const axiosResponse = await classroomApis.getOne(
            authRedux.token,
            classroomId
          );
          const data = axiosResponse.data;
          setInformation(data);
        }
      } catch (error) {
        message.error(parseErrorMessage(error));
      }
    };

    getOne();
  }, [authRedux.token, classroomId, tabIndex]);

  const onTabsChange = (key) => {
    setTabIndex(key);
  };

  return (
    <>
      <Breadcrumb />
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => history.push('/classrooms')}
      >
        Back to Classroom List
      </Button>

      <Divider />

      <Card
        title={
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
        }
      >
        <Tabs defaultActiveKey="1" onChange={onTabsChange}>
          <TabPane tab="Information" key="1">
            {information ? (
              <DetailInformation information={information} />
            ) : null}
          </TabPane>
          {/* <TabPane tab="Purchase History" key="2">
                                        {purchaseHistory
                                            ? 
                                            <PurchaseHistory
                                                stripeHistory={purchaseHistory.paymentHistoryStripe}
                                              />
                                            : 'Empty'}
                                    </TabPane> */}
        </Tabs>
      </Card>
    </>
  );
}
