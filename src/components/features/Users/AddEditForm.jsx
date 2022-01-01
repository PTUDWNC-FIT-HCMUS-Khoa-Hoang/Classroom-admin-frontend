/* eslint-disable react/prop-types */
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Spin,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import VerificationTag from './VerificationTag';

// constants
const MODES = {
  edit: 'edit',
  add: 'add',
};
const USER_STATUS_PROTOTYPE = {
  ACTIVE: {
    content: 'Active',
    color: 'green',
  },
  BLOCKED: {
    content: 'Blocked',
    color: 'volcano',
  },
  DELETED: {
    content: 'Deleted',
    color: 'red',
  },
};

const DeletedStatusField = ({ value = false, onChange }) => {
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setIsDeleted(value);
  }, [value]);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const onDeletedChange = (e) => {
    const newIsDeleted = Boolean(e.target.checked);

    setIsDeleted(newIsDeleted);

    triggerChange(newIsDeleted);
  };

  const renderDeletedStatus = () => {
    // const iconStyles = {
    //   fontSize: '20px',
    //   cursor: 'pointer',
    // };

    if (isDeleted) {
      return (
        <>
          <Tag color={USER_STATUS_PROTOTYPE.DELETED.color}>Deleted</Tag>
        </>
      );
    }

    return (
      <>
        <Tag color={USER_STATUS_PROTOTYPE.ACTIVE.color}>Not deleted</Tag>
      </>
    );
  };

  return (
    <Checkbox checked={isDeleted} onChange={onDeletedChange}>
      {renderDeletedStatus()}
    </Checkbox>
  );
};

const ActiveStatusField = ({ value = false, onChange }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(value);
  }, [value]);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const onIsActiveChange = (e) => {
    const newIsActive = Boolean(e.target.checked);

    setIsActive(newIsActive);

    triggerChange(newIsActive);
  };

  const renderActiveStatus = () => {
    // const iconStyles = {
    //   fontSize: '20px',
    //   cursor: 'pointer',
    // };

    if (!isActive) {
      return (
        <>
          <Tag color={USER_STATUS_PROTOTYPE.BLOCKED.color}>Blocked</Tag>
        </>
      );
    }

    return (
      <Space>
        <Tag color={USER_STATUS_PROTOTYPE.ACTIVE.color}>Active</Tag>
      </Space>
    );
  };

  return (
    <Checkbox checked={isActive} onChange={onIsActiveChange}>
      {renderActiveStatus()}
    </Checkbox>
  );
};

export default function AddEditForm({
  information,
  onSyncSubmit,
  onAsyncSubmit,
  mode = 'edit',
}) {
  // Parsing props
  const { email, studentId, isVerified, isDeleted, isActive } =
    information || {};

  //   useState
  const [isLoading, setIsLoading] = useState(false);
  //   check disabled attribute functions
  const shouldBeDisabled = () => {
    return mode.toLowerCase() === MODES.edit;
  };
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

  //   Render functions

  return (
    <Spin spinning={isLoading}>
      <Form
        style={{
          width: '85vw',
          backgroundColor: 'white',
          padding: 15,
          borderRadius: '5px',
        }}
        name="add-edit-user-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        onFinish={handleFormFinish}
        onFinishFailed={handleFormFinishFailed}
        autoComplete="off"
        layout="vertical"
        initialValues={{
          email,
          studentId,
          isDeleted,
          isActive,
        }}
      >
        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input placeholder="Email" disabled={shouldBeDisabled()} />
        </Form.Item>
        {/* Password */}
        {mode === 'edit' ? null : (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input placeholder="Password" type="password" />
          </Form.Item>
        )}
        {/* Country */}
        <Form.Item label="Student ID" name="studentId">
          <Input placeholder="Student ID" />
        </Form.Item>
        {/* Verification */}
        <Form.Item label="Verification" name="isVerified">
          <VerificationTag isVerified={isVerified} />
        </Form.Item>
        {/* Is Deleted */}
        <Row>
          <Col span={24}>
            <Form.Item label="Is Deleted" name="isDeleted">
              <DeletedStatusField />
            </Form.Item>
          </Col>
        </Row>
        {/* Is Active (Status) */}
        <Row>
          <Col span={24}>
            <Form.Item label="Status" name="isActive">
              <ActiveStatusField />
            </Form.Item>
          </Col>
        </Row>
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
