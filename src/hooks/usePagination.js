import { useEffect, useState } from 'react';
import useQuery from './useQuery';

const usePagination = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');

  const { query, appendQueryUrl } = useQuery();

  const handlePaginationChange = (newPage, newPerPage) => {
    appendQueryUrl({
      page: newPage,
      perPage: newPerPage,
    });
  };

  const handleSortChange = (sortBy, order) => {
    appendQueryUrl({
      sortBy,
      order,
    });
  };

  // subscription
  useEffect(() => {
    const queryPage = parseInt(query.get('page'));
    const queryPerPage = parseInt(query.get('perPage'));
    const querySortBy = query.get('sortBy');
    const queryOrder = query.get('order');

    setPage(queryPage || 1);
    setPerPage(queryPerPage || 10);
    setSortBy(querySortBy || '');
    setOrder(queryOrder || '');
  }, [query]);

  return {
    page,
    perPage,
    sortBy,
    order,
    handlePaginationChange,
    handleSortChange,
  };
};

export default usePagination;
