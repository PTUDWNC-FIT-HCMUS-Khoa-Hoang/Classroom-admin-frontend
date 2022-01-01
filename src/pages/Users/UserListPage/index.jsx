import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  LockTwoTone,
  UnlockTwoTone,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import userApis from '../../../api/users';
import SearchBar from '../../../components/shared/SearchBar';
import parseErrorMessage from '../../../helpers/parseErrorMessage';
import capitalizeWord from '../../../helpers/string/capitalizeWord';
import Breadcrumb from './Breadcrumb';

const UserListPage = () => {
  // Constants
  const MODEL_NAMES = {
    singular: 'user',
    plural: 'users',
  };
  const ACTIONS = {
    DELETE: 'delete',
    DEACTIVATE: 'deactivate',
    ACTIVATE: 'activate',
  };
  // Clientside states
  const [searchString, setSearchString] = useState('');
  // Serverside states
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  // Redux
  const authRedux = useSelector((state) => state.auth);
  // Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // History
  const history = useHistory();
  // Modal properties
  const [modalProperties, setModalProperties] = useState({
    confirmButtonText: '',
    confirmButtonColor: '',
    title: '',
    text: '',
    handleOk: async () => {
      return {
        status: '',
        id: '',
      };
    },
  });
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      name: 'Full name',
      selector: (row) => row.fullname,
      sortable: true,
      center: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      center: true,
      grow: 2,
    },
    {
      name: 'Student ID',
      selector: (row) => row.studentId,
      sortable: true,
      center: true,
    },
    {
      name: 'Deleted',
      selector: (row) => row.isDeleted,
      sortable: true,
      center: true,
      cell: (row) => {
        return row.isDeleted ? (
          <Tag color="error">Deleted</Tag>
        ) : (
          <Tag color="success">Not deleted</Tag>
        );
      },
    },
    {
      name: 'Status',
      selector: (row) => row.isActive,
      sortable: true,
      center: true,
      cell: (row) => {
        return row.isActive ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="error">Blocked</Tag>
        );
      },
    },
    {
      name: 'Actions',
      sortable: false,
      center: true,
      cell: (row) => {
        const iconStyles = {
          fontSize: '20px',
          cursor: 'pointer',
        };

        return (
          <div>
            <Row>
              <Space>
                <Col>
                  <Tooltip title="Edit">
                    <EditTwoTone
                      style={iconStyles}
                      twoToneColor="#315659"
                      onClick={() => EditTableDatum(row.id)}
                    />
                  </Tooltip>
                </Col>

                <Col>
                  <Tooltip title="View">
                    <EyeTwoTone
                      style={iconStyles}
                      onClick={() => ViewTableDatumDetail(row.id)}
                    />
                  </Tooltip>
                </Col>

                <Col>
                  <Tooltip title="Delete">
                    <DeleteTwoTone
                      twoToneColor="#eb4b2f"
                      style={iconStyles}
                      onClick={() => RemoveTableDatum(row.id, row.email)}
                    />
                  </Tooltip>
                </Col>

                {row.isActive ? (
                  <Col>
                    <Tooltip title="Block">
                      <LockTwoTone
                        twoToneColor="#eb4b2f"
                        style={iconStyles}
                        onClick={() => DeactivateTableDatum(row.id, row.email)}
                      />
                    </Tooltip>
                  </Col>
                ) : (
                  <Col>
                    <Tooltip title="Unblock">
                      <UnlockTwoTone
                        twoToneColor="#AAD922"
                        style={iconStyles}
                        onClick={() => ActivateTableDatum(row.id, row.email)}
                      />
                    </Tooltip>
                  </Col>
                )}
              </Space>
            </Row>
          </div>
        );
      },
    },
  ];

  // Table datum actions
  const ViewTableDatumDetail = (id) => {
    history.push(`/${MODEL_NAMES.plural}/view/${id}`);
  };

  const RemoveTableDatum = (id, name) => {
    renderModal(ACTIONS.DELETE, id, name);
  };

  const ActivateTableDatum = (id, name) => {
    renderModal(ACTIONS.ACTIVATE, id, name);
  };

  const DeactivateTableDatum = (id, name) => {
    renderModal(ACTIONS.DEACTIVATE, id, name);
  };

  const EditTableDatum = (id) => {
    history.push(`/${MODEL_NAMES.plural}/edit/${id}`);
  };

  // handle functions
  const handleAdd = () => {
    history.push(`/${MODEL_NAMES.plural}/add`);
  };

  const handlePageChange = async (newPage) => {
    setPage(newPage);
  };

  const handlePerRowsChange = async (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const handleRowsSelects = async (e) => {};

  const handleModalOk = async () => {
    setIsModalLoading(true);
    try {
      const { status, id } = await modalProperties.handleOk();

      message.success(
        `Successfully ${status} ${MODEL_NAMES.singular} with id: ${id}!`
      );
    } catch (error) {
      message.error(error.message);
    }
    setIsModalVisible(false);
    setIsModalLoading(false);
  };

  const handleDataSearch = async (searchStr) => {
    try {
      const axiosRes = await userApis.getAll(authRedux.token, {
        search: searchStr,
        skip: (page - 1) * perPage,
        limit: perPage,
      });
      const response = axiosRes.data;
      setTableData(response.data);
      setSearchString(searchStr);
    } catch (error) {
      message.error(parseErrorMessage(error));
    }
  };

  // useEffect
  // Get total
  useEffect(() => {
    const getTotal = async () => {
      try {
        const axiosRes = await userApis.getAll(authRedux.token, {
          search: searchString,
        });
        const response = axiosRes.data;
        setTotal(response.data.length);
      } catch (error) {
        setTableData([]);
        message.error(
          (error.response?.message || error.message || 'An unknown error') +
            ' has occurred!'
        );
      }
    };
    getTotal();
  }, [authRedux.token, searchString]);
  // Getting object (pagination)
  useEffect(() => {
    async function getData({ page, perPage }) {
      setLoading(true);
      try {
        const axiosRes = await userApis.getAll(authRedux.token, {
          skip: (page - 1) * perPage,
          limit: perPage,
          search: searchString,
        });
        const response = axiosRes.data;
        setTableData(response.data);
      } catch (error) {
        setTableData([]);
        message.error(
          (error.response?.message || error.message || 'An unknown error') +
            ' has occurred!'
        );
      }
      setLoading(false);
    }
    getData({ page, perPage });
  }, [authRedux.token, page, perPage, searchString]);

  // Render functions
  const renderModal = (actionTitle, objectId, objective) => {
    const modalText = (
      <>
        Do you really want to {actionTitle.toLowerCase()}{' '}
        <strong>{`${MODEL_NAMES.singular}: ${objective}`}</strong>
      </>
    );
    switch (actionTitle.toLowerCase()) {
      case ACTIONS.DELETE: {
        setModalProperties({
          title: `Delete ${MODEL_NAMES.singular}`,
          confirmButtonText: 'Delete',
          confirmButtonColor: 'red',
          text: modalText,
          handleOk: async () => {
            try {
              await userApis.deleteOne(authRedux.token, objectId);

              setTableData((tableData) => {
                const temp = tableData.map((datum) => {
                  if (datum.id === objectId) {
                    datum.isDeleted = true;
                  }
                  return datum;
                });

                return temp;
              });

              return {
                status: 'deleted',
                id: objectId,
              };
            } catch (error) {
              throw new Error(parseErrorMessage(error));
            }
          },
        });
        break;
      }
      case ACTIONS.DEACTIVATE: {
        setModalProperties({
          title: `Block ${MODEL_NAMES.singular}`,
          confirmButtonText: 'Block',
          confirmButtonColor: 'red',
          text: modalText,
          handleOk: async () => {
            try {
              await userApis.putOne(authRedux.token, objectId, {
                isActive: false,
              });

              setTableData((tableData) => {
                const temp = tableData.map((datum) => {
                  if (datum.id === objectId) {
                    datum.isActive = false;
                  }
                  return datum;
                });

                return temp;
              });

              return {
                status: 'blocked',
                id: objectId,
              };
            } catch (error) {
              throw new Error(parseErrorMessage(error));
            }
          },
        });
        break;
      }
      case ACTIONS.ACTIVATE: {
        setModalProperties({
          title: `Unblock ${MODEL_NAMES.singular}`,
          confirmButtonText: 'Unblock',
          confirmButtonColor: 'green',
          text: modalText,
          handleOk: async () => {
            try {
              await userApis.putOne(authRedux.token, objectId, {
                isActive: true,
              });

              setTableData((tableData) => {
                const temp = tableData.map((datum) => {
                  if (datum.id === objectId) {
                    datum.isActive = true;
                  }
                  return datum;
                });

                return temp;
              });

              return {
                status: 'unblocked',
                id: objectId,
              };
            } catch (error) {
              throw new Error(parseErrorMessage(error));
            }
          },
        });
        break;
      }
      default: {
        return;
      }
    }

    setIsModalVisible(true);
  };

  return (
    <>
      <Breadcrumb
        title={`${capitalizeWord(MODEL_NAMES.singular)} List`}
        parent={capitalizeWord(MODEL_NAMES.plural)}
      />
      <div className="container-fluid">
        <Row justify="end" gutter={{ sm: 24, md: 12, lg: 8 }}>
          <Col>
            <SearchBar
              text="User's name, email or student ID"
              handleAsyncSearch={handleDataSearch}
            />
          </Col>
        </Row>
        {searchString.length === 0 ? null : (
          <Row>
            <Col span={24}>
              <h3>Search results for: </h3>
              <h3 style={{ fontWeight: 900 }}>{searchString}</h3>
            </Col>
          </Row>
        )}
        <Row>
          {/* <!-- Individual column searching (text inputs) Starts--> */}
          <Col span={24}>
            <Button
              className="btn btn-primary btn-lg"
              type="primary"
              onClick={handleAdd}
            >
              Add {capitalizeWord(MODEL_NAMES.singular)}
            </Button>

            <Divider />

            <Modal
              title={modalProperties.title}
              visible={isModalVisible}
              onOk={handleModalOk}
              onCancel={() => setIsModalVisible(false)}
              footer={
                <Button
                  type="primary"
                  loading={isModalLoading}
                  onClick={handleModalOk}
                  style={{
                    backgroundColor: modalProperties.confirmButtonColor,
                    borderColor: modalProperties.confirmButtonColor,
                  }}
                >
                  {modalProperties.confirmButtonText}
                </Button>
              }
            >
              <p>{modalProperties.text}</p>
            </Modal>
            <DataTable
              noHeader
              columns={columns}
              data={tableData}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={total}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              onSelectedRowsChange={handleRowsSelects}
            />
          </Col>
          {/* <!-- Individual column searching (text inputs) Ends--> */}
        </Row>
      </div>
    </>
  );
};

export default UserListPage;

// import {
//   CheckSquareTwoTone,
//   DeleteTwoTone,
//   EditTwoTone,
//   EyeTwoTone,
//   InteractionTwoTone,
//   LockTwoTone,
// } from '@ant-design/icons';
// import {
//   Button,
//   Col,
//   Divider,
//   message,
//   Modal,
//   Row,
//   Space,
//   Tag,
//   Tooltip,
// } from 'antd';
// import React, { Fragment, useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import userApis from '../../../api/users';
// import Breadcrumb from './Breadcrumb';
// import SearchBar from '../../../components/shared/SearchBar';
// import parseErrorMessage from '../../../helpers/parseErrorMessage';

// const UsersListPage = () => {
//   // Constants
//   const MODEL_NAMES.singular = 'user';
//   const MODEL = 'users';
//   const USER_STATUS_PROTOTYPES = {
//     active: {
//       content: 'Active',
//       color: 'green',
//     },
//     blocked: {
//       content: 'Blocked',
//       color: 'volcano',
//     },
//     deleted: {
//       content: 'Deleted',
//       color: 'red',
//     },
//   };
//   const ACTIONS = {
//     DELETE: 'delete',
//     RECOVER: 'recover',
//     BLOCK: 'block',
//     ACTIVATE: 'activate',
//   };
//   // Clientside states
//   const [searchString, setSearchString] = useState('');
//   // Serverside states
//   const [tableData, setTableData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   // Redux
//   const authRedux = useSelector((state) => state.auth);
//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   // History
//   const history = useHistory();
//   // Modal properties
//   const [modalProperties, setModalProperties] = useState({
//     confirmButtonText: '',
//     confirmButtonColor: '',
//     title: '',
//     text: '',
//     handleOk: async () => {
//       return {
//         status: '',
//         userId: '',
//       };
//     },
//   });
//   const [isModalLoading, setIsModalLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const columns = [
//     {
//       name: 'Full name',
//       selector: (row) => row.fullname,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Email',
//       selector: (row) => row.email,
//       sortable: true,
//       center: true,
//       grow: 2,
//     },
//     {
//       name: 'Student ID',
//       selector: (row) => row.studentId,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: 'Actions',
//       sortable: false,
//       center: true,
//       cell: (row) => {
//         const iconStyles = {
//           fontSize: '20px',
//           cursor: 'pointer',
//         };

//         return (
//           <div>
//             <Row>
//               <Space>
//                 {/* {!checkFunctionality.byTitle(
//                   functionalityList.canEditUser.title
//                 ) ? null : ( */}
//                 <Col>
//                   <Tooltip title="Edit">
//                     <EditTwoTone
//                       style={iconStyles}
//                       twoToneColor="#315659"
//                       onClick={() => EditTableDatum(row._id)}
//                     />
//                   </Tooltip>
//                 </Col>

//                 {/* {!checkFunctionality.byTitle(
//                   functionalityList.canGetOneUser.title
//                 ) ? null : ( */}
//                 <Col>
//                   <Tooltip title="View">
//                     <EyeTwoTone
//                       style={iconStyles}
//                       onClick={() => ViewTableDatumDetail(row._id)}
//                     />
//                   </Tooltip>
//                 </Col>
//               </Space>
//             </Row>
//           </div>
//         );
//       },
//     },
//   ];

//   // Table datum actions
//   const ViewTableDatumDetail = (id) => {
//     history.push(`/${MODEL}/view/${id}`);
//   };

//   const RemoveTableDatum = (id) => {
//     renderModal(ACTIONS.DELETE, id);
//   };

//   const EditTableDatum = (id) => {
//     history.push(`/${MODEL}/edit/${id}`);
//   };

//   // handle functions
//   const handleAdd = () => {
//     history.push(`/${MODEL}/add`);
//   };

//   const handlePageChange = async (newPage) => {
//     setPage(newPage);
//   };

//   const handlePerRowsChange = async (newPerPage, newPage) => {
//     setPerPage(newPerPage);
//     setPage(newPage);
//   };

//   const handleRowsSelects = async (e) => {};

//   const handleModalOk = async () => {
//     setIsModalLoading(true);
//     try {
//       const { status, userId } = await modalProperties.handleOk();
//       setTableData((oldTableData) =>
//         oldTableData.map((tableDatum) => {
//           if (tableDatum._id === userId) {
//             tableDatum.status = status;
//           }
//           return tableDatum;
//         })
//       );
//       message.success('Successfully!');
//     } catch (error) {
//       message.error(error.message);
//     }
//     setIsModalVisible(false);
//     setIsModalLoading(false);
//   };

//   const handleUsersSearch = async (searchStr) => {
//     try {
//       const axiosRes = await userApis.getAll(authRedux.token, {
//         search: searchStr,
//         skip: (page - 1) * perPage,
//         limit: perPage,
//       });
//       const response = axiosRes.data;
//       setTableData(response.data);
//       setSearchString(searchStr);
//     } catch (error) {
//       message.error(parseErrorMessage(error));
//     }
//   };

//   // useEffect
//   // Get total
//   useEffect(() => {
//     const getTotal = async () => {
//       try {
//         const axiosRes = await userApis.getAll(authRedux.token, {
//           search: searchString,
//         });
//         const response = axiosRes.data;
//         setTotal(response.data.length);
//       } catch (error) {
//         setTableData([]);
//         message.error(
//           (error.response?.message || error.message || 'An unknown error') +
//             ' has occurred!'
//         );
//       }
//     };
//     getTotal();
//   }, [authRedux.token, searchString]);
//   // Getting object (pagination)
//   useEffect(() => {
//     async function getUsers({ page, perPage }) {
//       setLoading(true);
//       try {
//         const axiosRes = await userApis.getAll(authRedux.token, {
//           skip: (page - 1) * perPage,
//           limit: perPage,
//           search: searchString,
//         });
//         const response = axiosRes.data;
//         setTableData(response.data);
//       } catch (error) {
//         setTableData([]);
//         message.error(
//           (error.response?.message || error.message || 'An unknown error') +
//             ' has occurred!'
//         );
//       }

//       // // Mock test
//       // setTableData([
//       //   {
//       //     _id: '1',
//       //     fullname: 'Khoa Tran',
//       //     email: 'khoa@hmsp.com.au',
//       //     phone: '0123456789',
//       //     isVipMember: true,
//       //     status: 'Active',
//       //   },
//       //   {
//       //     _id: '2',
//       //     fullname: 'Pon Le',
//       //     email: 'pon@hmsp.com.au',
//       //     phone: '0123456789',
//       //     isVipMember: true,
//       //     status: 'Deleted',
//       //   },
//       //   {
//       //     _id: '3',
//       //     fullname: 'Khoa Tran Le',
//       //     email: 'khoatle@hmsp.com.au',
//       //     phone: '0123456789',
//       //     isVipMember: false,
//       //     status: 'Blocked',
//       //   },
//       // ]);
//       setLoading(false);
//     }
//     getUsers({ page, perPage });
//   }, [authRedux.token, page, perPage, searchString]);

//   // Render functions
//   const renderModal = (actionTitle, objectId) => {
//     const modalText = (
//       <>
//         Do you really want to {actionTitle.toLowerCase()}{' '}
//         <strong>{`this ${MODEL_NAMES.singular}`}</strong>
//       </>
//     );
//     switch (actionTitle.toLowerCase()) {
//       case ACTIONS.DELETE: {
//         setModalProperties({
//           title: `Delete ${MODEL_NAMES.singular}`,
//           confirmButtonText: 'Delete',
//           confirmButtonColor: 'red',
//           text: modalText,
//           handleOk: async () => {
//             try {
//               await userApis.putOne(authRedux.token, objectId, {
//                 status: USER_STATUS_PROTOTYPES.deleted.content.toLowerCase(),
//               });
//               return {
//                 status: USER_STATUS_PROTOTYPES.deleted.content.toLowerCase(),
//                 userId: objectId,
//               };
//             } catch (error) {
//               throw new Error(parseErrorMessage(error));
//             }
//           },
//         });
//         break;
//       }
//       case ACTIONS.BLOCK: {
//         setModalProperties({
//           title: `Block ${MODEL_NAMES.singular}`,
//           confirmButtonText: 'Block',
//           confirmButtonColor: 'yellow',
//           text: modalText,
//           handleOk: async () => {
//             try {
//               await userApis.putOne(authRedux.token, objectId, {
//                 status: USER_STATUS_PROTOTYPES.blocked.content.toLowerCase(),
//               });
//               return {
//                 status: USER_STATUS_PROTOTYPES.blocked.content.toLowerCase(),
//                 userId: objectId,
//               };
//             } catch (error) {
//               throw new Error(parseErrorMessage(error));
//             }
//           },
//         });
//         break;
//       }
//       case ACTIONS.RECOVER: {
//         setModalProperties({
//           title: `Recover ${MODEL_NAMES.singular}`,
//           confirmButtonText: 'Recover',
//           confirmButtonColor: 'yellow',
//           text: modalText,
//           handleOk: async () => {
//             try {
//               await userApis.putOne(authRedux.token, objectId, {
//                 status: USER_STATUS_PROTOTYPES.active.content.toLowerCase(),
//               });
//               return {
//                 status: USER_STATUS_PROTOTYPES.active.content.toLowerCase(),
//                 userId: objectId,
//               };
//             } catch (error) {
//               throw new Error(parseErrorMessage(error));
//             }
//           },
//         });
//         break;
//       }
//       default: {
//         setModalProperties({
//           title: `Activate ${MODEL_NAMES.singular}`,
//           confirmButtonText: 'Activate',
//           confirmButtonColor: 'green',
//           text: modalText,
//           handleOk: async () => {
//             try {
//               await userApis.putOne(authRedux.token, objectId, {
//                 status: USER_STATUS_PROTOTYPES.active.content.toLowerCase(),
//               });
//               return {
//                 status: USER_STATUS_PROTOTYPES.active.content.toLowerCase(),
//                 userId: objectId,
//               };
//             } catch (error) {
//               throw new Error(parseErrorMessage(error));
//             }
//           },
//         });
//       }
//     }

//     setIsModalVisible(true);
//   };

//   return (
//     <Fragment>
//       <Breadcrumb />
//       <div className="container-fluid">
//         <div className="d-flex flex-column"></div>
//         <Row justify="end" gutter={{ sm: 24, md: 12, lg: 8 }}>
//           <Col>
//             <SearchBar
//               text="User's name, email or student ID"
//               handleAsyncSearch={handleUsersSearch}
//             />
//           </Col>
//         </Row>
//         {searchString.length === 0 ? null : (
//           <Row>
//             <Col span={24}>
//               <h3>Search results for: </h3>
//               <h3 style={{ fontWeight: 900 }}>{searchString}</h3>
//             </Col>
//           </Row>
//         )}
//         <div className="my-4" />
//         <Row>
//           {/* <!-- Individual column searching (text inputs) Starts--> */}
//           <Col span={24}>
//             <Row>
//               <Col span={24}>
//                 <Button
//                   type="primary"
//                   size="large"
//                   onClick={handleAdd}
//                   // disabled={
//                   //   !checkFunctionality.byTitle(
//                   //     functionalityList.canAddUser.title
//                   //   )
//                   // }
//                 >
//                   Add User
//                 </Button>
//               </Col>
//               <Divider />
//               <Col span={24}>
//                 <Modal
//                   title={modalProperties.title}
//                   visible={isModalVisible}
//                   onOk={handleModalOk}
//                   onCancel={() => setIsModalVisible(false)}
//                   footer={
//                     <Button
//                       type="primary"
//                       loading={isModalLoading}
//                       onClick={handleModalOk}
//                     >
//                       {modalProperties.confirmButtonText}
//                     </Button>
//                   }
//                 >
//                   <p>{modalProperties.text}</p>
//                 </Modal>
//                 <div className="table-responsive product-table">
//                   <DataTable
//                     noHeader
//                     columns={columns}
//                     data={tableData}
//                     progressPending={loading}
//                     pagination
//                     paginationServer
//                     paginationTotalRows={total}
//                     onChangeRowsPerPage={handlePerRowsChange}
//                     onChangePage={handlePageChange}
//                     onSelectedRowsChange={handleRowsSelects}
//                   />
//                 </div>
//               </Col>
//             </Row>
//           </Col>
//           {/* <!-- Individual column searching (text inputs) Ends--> */}
//         </Row>
//       </div>
//     </Fragment>
//   );
// };

// export default UsersListPage;
