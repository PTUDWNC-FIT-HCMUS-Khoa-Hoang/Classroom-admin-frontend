import React from 'react';
import { Tag } from 'antd';

const USER_TYPE_PROTOTYPES = {
  new: {
    title: 'new',
    content: 'New member',
    color: 'gold',
  },
  unpaid: {
    title: 'unpaid',
    content: 'Unpaid member',
    color: '',
  },
  loyalty: {
    title: 'loyalty',
    content: 'Loyalty member',
    color: 'purple',
  },
  admin: {
    title: 'admin',
    content: 'Administrator',
    color: 'red',
  },
};

export default function TypeTag({ isAdmin = false, typeString = '' }) {
  const findUserType = () => {
    if (isAdmin) {
      return USER_TYPE_PROTOTYPES.admin;
    }

    switch (typeString) {
      case USER_TYPE_PROTOTYPES.new.title: //new
        return USER_TYPE_PROTOTYPES.new;
      case USER_TYPE_PROTOTYPES.loyalty.title: //loyalty
        return USER_TYPE_PROTOTYPES.loyalty;
      default:
        //unpaid
        return USER_TYPE_PROTOTYPES.unpaid;
    }
  };

  return <Tag color={findUserType().color}>{findUserType().content}</Tag>;
}
