import { Button, Form, Input, message, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import authApis from '../../api/auth';
import STATUS from '../../constants/status';
import parseErrorMessage from '../../helpers/parseErrorMessage';

export default function RegisterPage() {
  //#region react-router hooks
  const history = useHistory();
  //#endregion

  //#region useState (status)
  const [status, setStatus] = useState(STATUS.IDLE);
  //#endregion

  //#region handle functions
  const handleRegisterFormSubmit = async (formValues) => {
    console.log('Success:', formValues);
    setStatus(STATUS.LOADING);
    try {
      await authApis.register(
        formValues.fullname,
        formValues.email,
        formValues.password
      );
      message.success('Successfully registered user');
      setTimeout(() => {
        history.push('/login');
      }, 500);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      message.error(parseErrorMessage(error));
      setStatus(STATUS.ERROR);
    }
  };

  const handleRegisterFormSubmitFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.warning('Please make sure to fill in all of required fields');
  };

  //#endregion

  return (
    <Spin spinning={status === STATUS.LOADING}>
      <div
        style={{
          marginTop: 30,
          backgroundColor: 'white',
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Row justify="center">
          <h1>Register</h1>
        </Row>
        <Row justify="center">
          <Form
            name="register-form"
            labelCol={{
              md: { offset: 8, span: 8 },
              sm: { offset: 3, span: 18 },
            }}
            wrapperCol={{
              md: { offset: 8, span: 8 },
              sm: { offset: 3, span: 18 },
            }}
            initialValues={{ remember: true }}
            onFinish={handleRegisterFormSubmit}
            onFinishFailed={handleRegisterFormSubmitFailed}
            autoComplete="off"
            layout="vertical"
            style={{ width: '100%' }}
          >
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[
                { required: true, message: 'Please input your fullname!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  type: 'email',
                  message: 'Please input a valid email!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </div>
    </Spin>
  );
}
