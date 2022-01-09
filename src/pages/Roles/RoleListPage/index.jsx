import { EditTwoTone } from '@ant-design/icons';
import { TablePagination } from '@trendmicro/react-paginations';
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Space,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import roleApis from '../../../api/roles';
import SearchBar from '../../../components/shared/SearchBar';
import capitalizeWord from '../../../helpers/string/capitalizeWord';
import { usePagination } from '../../../hooks';
import Breadcrumb from './Breadcrumb';

const RoleListPage = () => {
  // Constants
  const MODEL_NAMES = {
    singular: 'role',
    plural: 'roles',
  };

  // Serverside states
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  // Redux
  const authRedux = useSelector((state) => state.auth);
  // Pagination states
  // const [page, setPage] = useState(1);
  // const [perPage, setPerPage] = useState(10);
  const {
    page,
    perPage,
    sortBy,
    order,
    searchString,
    handlePaginationChange,
    handleSearchChange,
  } = usePagination();
  // History
  const history = useHistory();
  // Modal properties
  const [modalProperties] = useState({
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
      name: 'Title',
      selector: (row) => row.title?.toUpperCase(),
      sortable: true,
      center: true,
    },
    {
      name: 'Functionalities',
      selector: (row) => row.functionalityList?.length,
      sortable: true,
      center: true,
      grow: 2,
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
                      onClick={() => EditTableDatum(row._id)}
                    />
                  </Tooltip>
                </Col>
              </Space>
            </Row>
          </div>
        );
      },
    },
  ];

  // Table datum actions

  const EditTableDatum = (id) => {
    history.push(`/${MODEL_NAMES.plural}/edit/${id}`);
  };

  // handle functions
  const handleAdd = () => {
    history.push(`/${MODEL_NAMES.plural}/add`);
  };

  const handlePageChange = (newPage) => {
    handlePaginationChange(newPage);
  };

  const handlePerRowsChange = (newPerPage, newPage) => {
    handlePaginationChange(newPage, newPerPage);
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

  const handleDataSearch = (searchStr) => {
    handleSearchChange(searchStr);
  };

  // useEffect
  // Get total
  useEffect(() => {
    const getTotal = async () => {
      try {
        const axiosRes = await roleApis.getAll(authRedux.token, {
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
        const axiosRes = await roleApis.getAll(authRedux.token, {
          skip: (page - 1) * perPage,
          limit: perPage,
          search: searchString,
          sortBy,
          order,
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
  }, [authRedux.token, page, perPage, searchString, sortBy, order]);

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
              text="Role's title"
              handleAsyncSearch={handleDataSearch}
              defaultValue={searchString}
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
            <Space>
              <Button
                className="btn btn-primary btn-lg"
                type="primary"
                onClick={handleAdd}
              >
                Add {capitalizeWord(MODEL_NAMES.singular)}
              </Button>
            </Space>

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

            <Row>
              <Col span={24}>
                <DataTable
                  keyField="id"
                  noHeader
                  columns={columns}
                  data={tableData}
                  progressPending={loading}
                  // pagination
                  paginationServer
                  paginationTotalRows={total}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  onSelectedRowsChange={handleRowsSelects}
                />
              </Col>
              <Col span={24}>
                <Card style={{ width: '100%', border: 'none' }}>
                  <Divider />
                  <TablePagination
                    type="full"
                    page={page}
                    pageLength={perPage}
                    totalRecords={total}
                    onPageChange={({ page, pageLength }) => {
                      handlePaginationChange(page, pageLength);
                    }}
                    prevPageRenderer={() => '<'}
                    nextPageRenderer={() => '>'}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          {/* <!-- Individual column searching (text inputs) Ends--> */}
        </Row>
      </div>
    </>
  );
};

export default RoleListPage;
