/* eslint-disable react/prop-types */
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Descriptions, Tooltip } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default function DetailInformation({ information }) {
  const { title, subTitle, invitationCode, gradeStructure, owner } =
    information;

  return (
    <>
      {/* Information */}
      <Descriptions
        bordered
        layout="vertical"
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Title">{title || '_____'}</Descriptions.Item>
        <Descriptions.Item label="Sub title">
          {subTitle || '_____'}
        </Descriptions.Item>
        <Descriptions.Item label="Invitation Code">
          {invitationCode || '_____'}
        </Descriptions.Item>

        <Descriptions.Item label="Owner">
          <Link to={`/users/view/${owner._id}`}>{owner.email}</Link>
        </Descriptions.Item>

        <Descriptions.Item label="Grade Structure">
          <ul>
            {gradeStructure.map((gradeDetail) => (
              <li key={gradeDetail._id}>
                {gradeDetail.title}: {gradeDetail.grade}{' '}
                {gradeDetail.isFinalized ? (
                  <Tooltip title="Finalized">
                    <CheckCircleTwoTone twoToneColor="#49D49D" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Not finalized">
                    <CloseCircleTwoTone twoToneColor="#F24236" />
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
