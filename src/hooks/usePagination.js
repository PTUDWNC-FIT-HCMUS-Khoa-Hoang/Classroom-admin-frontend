import { useEffect, useState } from 'react';
import useQuery from './useQuery';

const usePagination = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');
  const [searchString, setSearchString] = useState('');

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

  const handleSearchChange = (newSearchString) => {
    appendQueryUrl({
      search: newSearchString,
    });
  };

  // subscription
  useEffect(() => {
    const queryPage = parseInt(query.get('page'));
    const queryPerPage = parseInt(query.get('perPage'));
    const querySortBy = query.get('sortBy');
    const queryOrder = query.get('order');
    const querySearchString = query.get('search');

    setPage(queryPage || 1);
    setPerPage(queryPerPage || 10);
    setSortBy(querySortBy || '');
    setOrder(queryOrder || '');
    setSearchString(querySearchString || '');
  }, [query]);

  return {
    page,
    perPage,
    sortBy,
    order,
    searchString,
    handlePaginationChange,
    handleSortChange,
    handleSearchChange,
  };
};

export default usePagination;
