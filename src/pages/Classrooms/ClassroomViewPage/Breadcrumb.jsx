import { Breadcrumb } from 'antd';
import { HomeOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';

import React from 'react';

export default function UserViewBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/classrooms">
        <CalendarOutlined />
        <span>Class List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <EyeOutlined />
        <span>Class View</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
