/* eslint-disable react/prop-types */
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import roleApis from '../../../api/roles';
import { useSelector } from 'react-redux';

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

const VerificationField = ({ value = false, onChange }) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsVerified(value);
  }, [value]);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const onIsVerifiedChange = (e) => {
    const newIsActive = Boolean(e.target.checked);

    setIsVerified(newIsActive);

    triggerChange(newIsActive);
  };

  const renderVerificationStatus = () => {
    // const iconStyles = {
    //   fontSize: '20px',
    //   cursor: 'pointer',
    // };

    if (!isVerified) {
      return (
        <>
          <Tag color={USER_STATUS_PROTOTYPE.BLOCKED.color}>Not verified</Tag>
        </>
      );
    }

    return (
      <Space>
        <Tag color={USER_STATUS_PROTOTYPE.ACTIVE.color}>Verified</Tag>
      </Space>
    );
  };

  return (
    <Checkbox checked={isVerified} onChange={onIsVerifiedChange}>
      {renderVerificationStatus()}
    </Checkbox>
  );
};

const RoleSelect = ({ value = '', onChange }) => {
  const [role, setRole] = useState(false);
  const [roles, setRoles] = useState([]);
  // redux
  const authRedux = useSelector((state) => state.auth);

  // useEffect
  useEffect(() => {
    setRole(value);
  }, [value]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const axiosRes = await roleApis.getAll(authRedux.token);
        const response = axiosRes.data;
        setRoles(response.data);
      } catch (error) {
        message.error(parseErrorMessage(error));
      }
    };
    getRoles();
  }, [authRedux.token]);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const onRoleChange = (value) => {
    const newRole = value;

    setRole(newRole);

    triggerChange(newRole);
  };

  return roles.length > 1 ? (
    <Select value={role} onChange={onRoleChange}>
      {roles.map((role) => (
        <Select.Option key={role._id} value={role._id}>
          {role.title.toUpperCase()}
        </Select.Option>
      ))}
    </Select>
  ) : (
    <Select disabled></Select>
  );
};

export default function AddEditForm({
  information,
  onSyncSubmit,
  onAsyncSubmit,
  mode = 'edit',
}) {
  // Parsing props
  const { email, fullname, role, isVerified, isDeleted, isActive } =
    information || {};

  // constants
  const MODEL_NAMES = {
    singular: 'account',
    plural: 'accounts',
  };

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
          fullname,
          email,
          role,
          isDeleted: isDeleted,
          isActive: typeof isActive === 'undefined' ? true : isActive,
          isVerified: typeof isVerified === 'undefined' ? true : isVerified,
        }}
      >
        {/* Fullname */}
        <Form.Item
          label="Fullname"
          name="fullname"
          rules={[
            {
              required: true,
              message: `Please input ${MODEL_NAMES.singular} fullname!`,
            },
          ]}
        >
          <Input placeholder="Fullname" />
        </Form.Item>
        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: `Please input ${MODEL_NAMES.singular} email!`,
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
                message: `Please input ${MODEL_NAMES.singular} password!`,
              },
            ]}
          >
            <Input
              placeholder="Password"
              type="password"
              disabled={shouldBeDisabled()}
            />
          </Form.Item>
        )}
        {/* Role */}
        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              message: `Role is required`,
            },
          ]}
        >
          <RoleSelect />
        </Form.Item>
        {/* Verification */}
        <Form.Item label="Verification" name="isVerified">
          <VerificationField />
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
