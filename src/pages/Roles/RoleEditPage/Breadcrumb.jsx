import { Breadcrumb } from 'antd';
import { HomeOutlined, TeamOutlined, EditFilled } from '@ant-design/icons';

import React from 'react';

export default function RoleEditBreadcrumb() {
  return (
    <Breadcrumb style={{ marginTop: 5, marginBottom: 5 }}>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/roles">
        <TeamOutlined />
        <span>Role List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <EditFilled />
        <span>Role Edit</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
