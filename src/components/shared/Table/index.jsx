import { TablePagination } from '@trendmicro/react-paginations';
import { Card, Col, Divider, Row } from 'antd';
import React from 'react';
import DataTable from './DataTable';

export default function Table({
  columns,
  data,
  loading,
  total,
  handlePerRowsChange,
  handlePageChange,
  page,
  perPage,
  handlePaginationChange,
}) {
  return (
    <Row>
      <Col span={24}>
        <DataTable
          keyField="id"
          noHeader
          columns={columns}
          data={data}
          progressPending={loading}
          // pagination
          paginationServer
          paginationTotalRows={total}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
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
  );
}
