import { Col, Layout, Menu, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import STATUS from '../../../constants/status';
import LogoutButton from './LogoutButton';

export default function NavBar() {
  //#region redux states
  const auth = useSelector((state) => state.auth);
  //#endregion

  //#region Menu state
  const [selectedMenu, setSelectedMenu] = useState('home');
  //#endregion

  //#region parse location & select nav item
  const location = useLocation();
  useEffect(() => {
    //#region constants
    const MENU_LIST = {
      home: 'home',
      courses: 'courses',
      login: 'login',
      // register: 'register',
    };
    //#endregion

    if (location.pathname.includes(MENU_LIST.courses)) {
      setSelectedMenu(MENU_LIST.courses);
    } else if (location.pathname.includes(MENU_LIST.login)) {
      setSelectedMenu(MENU_LIST.home);
      // } else if (location.pathname.includes(MENU_LIST.register)) {
      //   setSelectedMenu(MENU_LIST.register);
    } else {
      setSelectedMenu(MENU_LIST.home);
    }
  }, [location.pathname]);
  //#endregion

  return (
    <Layout.Header>
      <Row>
        <Col span={22}>
          <Menu theme="dark" mode="horizontal" selectedKeys={selectedMenu}>
            {auth.status === STATUS.SUCCESS ? (
              <>
                <Menu.Item key="home">
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="courses">
                  <Link to="/courses">Courses</Link>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item key="home">
                  <Link to="/login">Login</Link>
                </Menu.Item>
                {/* <Menu.Item key="register">
                  <Link to="/register">Register</Link>
                </Menu.Item> */}
              </>
            )}
          </Menu>
        </Col>
        <Col span={2}>
          {auth.status === STATUS.SUCCESS ? <LogoutButton /> : null}
        </Col>
      </Row>
    </Layout.Header>
  );
}
