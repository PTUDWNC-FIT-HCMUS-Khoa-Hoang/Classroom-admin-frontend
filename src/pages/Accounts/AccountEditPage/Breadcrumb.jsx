import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, EditFilled } from '@ant-design/icons';

import React from 'react';

export default function UserEditBreadcrumb() {
  return (
    <Breadcrumb style={{ marginTop: 5, marginBottom: 5 }}>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/accounts">
        <UserOutlined />
        <span>Account List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <EditFilled />
        <span>Account Edit</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
