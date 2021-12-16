const parseErrorMessage = (error) => {
  console.log(error.response);
  return (
    'Error: ' +
    (error.response?.data?.message ||
      error.response?.message ||
      error.message ||
      'Unknown error') +
    ' has occurred! Please try again!'
  );
};

export default parseErrorMessage;
