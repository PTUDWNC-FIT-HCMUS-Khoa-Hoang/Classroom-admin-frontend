import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';

import React from 'react';

export default function UserViewBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/users">
        <UserOutlined />
        <span>User List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <EyeOutlined />
        <span>User View</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
