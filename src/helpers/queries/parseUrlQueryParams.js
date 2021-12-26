const allowedKeys = ['skip', 'limit', 'search'];

const parseUrlQueryParams = (options) => {
  let optionString = '?';
  for (let optionKey in options) {
    // Check if there is any illegal query key
    const key = optionKey;
    if (!allowedKeys.includes(key)) {
      continue;
    }
    // Check query values
    const value = options[optionKey];
    if (typeof value === 'number') {
      if (value < 0) {
        continue;
      }
    }
    optionString += optionKey + '=' + value + '&';
  }

  if (optionString.length <= 1) {
    optionString = '';
  } else {
    optionString = optionString.slice(0, optionString.length - 1);
  }

  return optionString;
};

export default parseUrlQueryParams;
