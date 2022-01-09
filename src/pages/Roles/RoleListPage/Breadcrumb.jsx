import { Breadcrumb } from 'antd';
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';

import React from 'react';

export default function RoleListBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/roles">
        <TeamOutlined />
        <span>Role List</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
