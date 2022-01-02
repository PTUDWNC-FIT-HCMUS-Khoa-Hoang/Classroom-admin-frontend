import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';

import React from 'react';

export default function UserEditBreadcrumb() {
  return (
    <Breadcrumb style={{ marginTop: 5, marginBottom: 5 }}>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/users">
        <UserOutlined />
        <span>User List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <PlusOutlined />
        <span>User Add</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
