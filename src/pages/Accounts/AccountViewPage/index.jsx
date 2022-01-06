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
import accountApis from '../../../api/accounts';
import Breadcrumb from './Breadcrumb';
import DetailInformation from './DetailInformation';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import { useHistory, useParams } from 'react-router-dom';

const { TabPane } = Tabs;
const { Title } = Typography;

export default function AccountViewPage() {
  // react-router hooks
  const history = useHistory();
  const params = useParams();
  const accountId = params.id;
  // states
  const [tabIndex, setTabIndex] = useState(1);
  const [information, setInformation] = useState(null);
  // Redux hooks
  const authRedux = useSelector((state) => state.auth);
  // side effects
  useEffect(() => {
    const getOne = async () => {
      try {
        if (accountId) {
          //get information
          const axiosResponse = await accountApis.getOne(
            authRedux.token,
            accountId
          );
          const data = axiosResponse.data;
          setInformation(data);
        }
      } catch (error) {
        message.error(parseErrorMessage(error));
      }
    };

    getOne();
  }, [authRedux.token, accountId, tabIndex]);

  const onTabsChange = (key) => {
    setTabIndex(key);
  };

  return (
    <>
      <Breadcrumb />
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => history.push('/accounts')}
      >
        Back to Account List
      </Button>

      <Divider />

      <Card
        title={
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
