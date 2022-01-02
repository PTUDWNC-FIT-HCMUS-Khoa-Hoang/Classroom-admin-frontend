import React from 'react';

export default function DataTable({
  columns,
  data,
  loading,
  total,
  onChangeRowsPerPage,
  onChangePage,
}) {
  return (
    <DataTable
      keyField="id"
      noHeader
      columns={columns}
      data={data}
      progressPending={loading}
      // pagination
      paginationServer
      paginationTotalRows={total}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
    />
  );
}
