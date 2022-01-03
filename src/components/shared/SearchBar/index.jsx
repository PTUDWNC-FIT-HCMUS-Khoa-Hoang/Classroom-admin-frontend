import { Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import parseErrorMessage from '../../../helpers/parseErrorMessage';

export default function SearchForm({
  text,
  handleAsyncSearch,
  handleSyncSearch,
  defaultValue,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSearch = async (values) => {
    setIsLoading(true);
    try {
      if (handleAsyncSearch) {
        await handleAsyncSearch(values);
      } else {
        handleSyncSearch(values);
      }
    } catch (error) {
      message.error(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input.Search
        placeholder={text}
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        loading={isLoading}
        allowClear
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}
