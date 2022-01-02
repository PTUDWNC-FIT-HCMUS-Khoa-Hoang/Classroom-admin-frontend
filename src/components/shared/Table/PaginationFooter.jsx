import { TablePagination } from '@trendmicro/react-paginations';
import { Divider } from 'antd';
import React from 'react';

export default function PaginationFooter({
  page,
  perPage,
  total,
  handlePaginationChange,
}) {
  return (
    <>
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
    </>
  );
}
