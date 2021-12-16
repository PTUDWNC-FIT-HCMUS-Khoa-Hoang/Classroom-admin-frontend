import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../../redux/features/auth/slice';

export default function LogoutButton() {
  //#region redux hooks
  const dispatch = useDispatch();
  //#endregion

  //#region handle functions
  const handleLogoutClick = () => {
    dispatch(logoutAction());
  };
  //#endregion

  return (
    <Button onClick={handleLogoutClick} type="link">
      Logout
    </Button>
  );
}
