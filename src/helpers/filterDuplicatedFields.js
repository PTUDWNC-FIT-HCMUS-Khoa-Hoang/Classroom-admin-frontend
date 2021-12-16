const filterDuplicatedFields = ({ arr = [], fieldName = '' }) => {
  const fieldValues = arr.map((element) => element[fieldName]);

  const sortedFieldValues = fieldValues.sort();

  const filteredFieldValues = [];

  sortedFieldValues.forEach((owner) => {
    if (filteredFieldValues.length) {
      if (filteredFieldValues[filteredFieldValues.length - 1] !== owner) {
        filteredFieldValues.push(owner);
      }
    } else {
      filteredFieldValues.push(owner);
    }
  });

  return filteredFieldValues;
};

export default filterDuplicatedFields;
