import { Button, Form, Input, message, Row, Spin } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import STATUS from '../../constants/status';
import parseErrorMessage from '../../helpers/parseErrorMessage';
import authThunks from '../../redux/features/auth/thunks';

export default function LoginPage() {
  //#region redux hooks
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  //#endregion

  //#region react-router hooks
  //#endregion

  //#region handle functions
  const handleRegisterFormSubmit = async (formValues) => {
    try {
      dispatch(
        authThunks.login({
          email: formValues.email,
          password: formValues.password,
        })
      );
    } catch (error) {
      message.error(parseErrorMessage(error));
    }
  };

  const handleRegisterFormSubmitFailed = (errorInfo) => {
    message.warning('Please make sure to fill in all of required fields');
  };

  //#endregion

  return (
    <Spin spinning={auth.status === STATUS.LOADING}>
      <div
        style={{
          marginTop: 30,
          backgroundColor: 'white',
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Row justify="center">
          <h1>Login</h1>
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </div>
    </Spin>
  );
}
