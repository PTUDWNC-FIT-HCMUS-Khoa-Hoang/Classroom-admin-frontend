import { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const useQuery = () => {
  const { search } = useLocation();
  const history = useHistory();

  const query = useMemo(() => new URLSearchParams(search), [search]);

  const appendQueryUrl = (object) => {
    for (const key in object) {
      query.set(key, object[key]);
    }

    history.push({
      search: `?${query.toString()}`,
    });
  };

  return { query, appendQueryUrl };
};

export default useQuery;

//query = useQuery();
//query.get('page');
