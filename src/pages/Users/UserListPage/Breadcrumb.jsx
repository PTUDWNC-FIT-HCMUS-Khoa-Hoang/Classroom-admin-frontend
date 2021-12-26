import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

import React from 'react';

export default function UserListBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/users">
        <UserOutlined />
        <span>User List</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
