import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

import React from 'react';

export default function AccountListBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/accounts">
        <UserOutlined />
        <span>Account List</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
