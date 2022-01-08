import { Breadcrumb } from 'antd';
import { HomeOutlined, CalendarOutlined } from '@ant-design/icons';

import React from 'react';

export default function AccountListBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/classrooms">
        <CalendarOutlined />
        <span>Classroom List</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
