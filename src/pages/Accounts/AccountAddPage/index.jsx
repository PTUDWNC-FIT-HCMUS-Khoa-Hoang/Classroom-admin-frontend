import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import accountApis from '../../../api/accounts';
import AddEditForm from '../../../components/features/accounts/AddEditForm';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import capitalizeWord from '../../../helpers/string/capitalizeWord';
import Breadcrumb from './Breadcrumb';

export default function AccountAddPage() {
  // constants
  const MODEL_NAMES = {
    singular: 'account',
    plural: 'accounts',
  };

  // useHistory
  const history = useHistory();

  // Redux hooks
  const authRedux = useSelector((state) => state.auth);

  // handle functions
  const handleSubmitAddForm = async (formValues) => {
    try {
      await accountApis.postOne(authRedux.token, formValues);
      message.success(
        `Successfully created ${capitalizeWord(MODEL_NAMES.singular)}!`
      );
    } catch (error) {
      message.error(parseErrorMessage(error));
    }
  };

  return (
    <>
      <Breadcrumb
        parent={capitalizeWord(MODEL_NAMES.plural)}
        title={`Add ${capitalizeWord(MODEL_NAMES.singular)}`}
      />
      <div className="container-fluid">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push(`/${MODEL_NAMES.plural}`)}
        >
          Back to {capitalizeWord(MODEL_NAMES.singular)} List
        </Button>

        <Divider />

        <div className="row justify-content-center">
          <div className="card">
            <div className="card-header">
              <div style={{ width: 350 }}></div>
            </div>
            <div className="card-body">
              <div className="col">
                <AddEditForm onAsyncSubmit={handleSubmitAddForm} mode="add" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
