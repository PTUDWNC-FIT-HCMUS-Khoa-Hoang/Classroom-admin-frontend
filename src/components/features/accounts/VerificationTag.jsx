import React from 'react';
import { Tag } from 'antd';

export default function VerificationTag({ isVerified }) {
  return isVerified ? (
    <Tag color="green">Verified</Tag>
  ) : (
    <Tag color="red">Not verified</Tag>
  );
}
