import { EyeTwoTone } from '@ant-design/icons';
import { TablePagination } from '@trendmicro/react-paginations';
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import classroomApis from '../../../api/classrooms';
import SearchBar from '../../../components/shared/SearchBar';
import capitalizeWord from '../../../helpers/string/capitalizeWord';
import { usePagination } from '../../../hooks';
import Breadcrumb from './Breadcrumb';

const ClassroomListPage = () => {
  // Constants
  const MODEL_NAMES = {
    singular: 'classroom',
    plural: 'classrooms',
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
    handleSortChange,
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
      selector: (row) => row.title,
      sortable: true,
      center: true,
    },
    {
      name: 'Invitation code',
      selector: (row) => row.invitationCode,
      sortable: true,
      center: true,
    },
    {
      name: 'Owner',
      selector: (row) => row.owner.email,
      sortable: true,
      center: true,
      cell: (row) => (
        <Link to={`/users/view/${row.owner._id}`}>{row.owner.email}</Link>
      ),
      grow: 2,
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
                  <Tooltip title="View">
                    <EyeTwoTone
                      style={iconStyles}
                      onClick={() => ViewTableDatumDetail(row._id)}
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
  const ViewTableDatumDetail = (id) => {
    history.push(`/${MODEL_NAMES.plural}/view/${id}`);
  };

  // handle functions

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

  const handleCreatedAtSortChange = (value) => {
    const jsonValue = JSON.parse(value);

    handleSortChange(jsonValue.sortBy, jsonValue.order);
  };

  // useEffect
  // Get total
  useEffect(() => {
    const getTotal = async () => {
      try {
        const axiosRes = await classroomApis.getAll(authRedux.token, {
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
        const axiosRes = await classroomApis.getAll(authRedux.token, {
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

  // Render functions

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
              text="Classroom's name"
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
              <Select
                value={
                  sortBy.length > 1
                    ? JSON.stringify({
                        sortBy,
                        order,
                      })
                    : 'Sort'
                }
                onChange={handleCreatedAtSortChange}
                style={{ minWidth: '12.5rem' }}
              >
                <Select.Option
                  key="sort-1"
                  value={JSON.stringify({
                    sortBy: 'createdAt',
                    order: 'asc',
                  })}
                >
                  Created time: Ascending
                </Select.Option>
                <Select.Option
                  key="sort-2"
                  value={JSON.stringify({
                    sortBy: 'createdAt',
                    order: 'desc',
                  })}
                >
                  Created time: Descending
                </Select.Option>
              </Select>
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

export default ClassroomListPage;
