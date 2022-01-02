import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useQuery from './useQuery';

const usePagination = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const history = useHistory();
  const query = useQuery();

  const handlePaginationChange = (newPage, newPerPage) => {
    history.push({
      search: `?page=${newPage || page}&perPage=${newPerPage || perPage}`,
    });
  };

  useEffect(() => {
    const queryPage = query.get('page');
    const queryPerPage = query.get('perPage');

    setPage(queryPage || 1);
    setPerPage(queryPerPage || 10);
  }, [query]);

  return { page, perPage, handlePaginationChange };
};

export default usePagination;
