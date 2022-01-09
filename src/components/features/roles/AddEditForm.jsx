/* eslint-disable react/prop-types */
import { Button, Checkbox, Col, Form, message, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import functionalityApis from '../../../api/functionalities';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import parseCamalCase from '../../../helpers/parsers/parseCamalCase';

const FunctionalitiesSelect = ({ value = [], onChange }) => {
  const [functionalities, setFunctionalities] = useState([]);
  const authRedux = useSelector((state) => state.auth);

  useEffect(() => {
    const getFunctionalities = async () => {
      try {
        const axiosRes = await functionalityApis.getAll(authRedux.token);
        const functionalityData = axiosRes.data.data;
        setFunctionalities(functionalityData);
      } catch (error) {
        message.error(parseErrorMessage(error));
      }
    };
    getFunctionalities();
  }, [authRedux.token]);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const handleFunctionalitiesChange = (value) => {
    triggerChange(value);
  };

  const renderFunctionalityOptions = () => {
    return functionalities.length > 1
      ? functionalities.map((func) => {
          return (
            <Col span={24} key={func._id}>
              <Checkbox key={func._id} value={func._id}>
                {parseCamalCase(func.title)}
              </Checkbox>
            </Col>
          );
        })
      : null;
  };

  return (
    <Checkbox.Group value={value} onChange={handleFunctionalitiesChange}>
      <Row>{renderFunctionalityOptions()}</Row>
    </Checkbox.Group>
  );
};

export default function AddEditForm({
  information,
  onSyncSubmit,
  onAsyncSubmit,
  mode = 'edit',
}) {
  // Parsing props
  const { title, functionalityList } = information || {};

  //   useState
  const [isLoading, setIsLoading] = useState(false);
  //   handle functions
  const handleFormFinish = async (values) => {
    setIsLoading(true);
    console.log('Success:', values);

    try {
      if (onSyncSubmit) {
        onSyncSubmit(values);
      } else if (onAsyncSubmit) {
        await onAsyncSubmit(values);
      } else {
        console.log('No submit handler to be called!');
      }
    } catch (error) {
      message.error(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        name="add-edit-role-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        onFinish={handleFormFinish}
        onFinishFailed={handleFormFinishFailed}
        autoComplete="off"
        layout="vertical"
        initialValues={{
          title,
          functionalityList,
        }}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: '5px',
        }}
      >
        {/* Functionalities */}
        <Form.Item label="Functionalities" name="functionalityList">
          <FunctionalitiesSelect />
        </Form.Item>
        {/* Submit button */}
        <Form.Item wrapperCol={{ offset: 18 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
