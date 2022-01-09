const parseCamalCase = (str = '') => {
    const arr = str.split('');

    const newArr = arr.map((char) => {
        if (char >= 'A' && char <= 'Z') {
            return ' ' + char;
        }
        return char;
    });

    newArr[0] = newArr[0].toUpperCase();

    const result = newArr.join('');
    return result;
};

export default parseCamalCase;
