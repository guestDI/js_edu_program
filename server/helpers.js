const moment = require('moment');

const generateRandomNumber = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}

const generateRandomASCII = () => {
    return String.fromCharCode(generateRandomNumber(90, 65));
}

const updateCurrentDateTime = currentDate => {
  return moment(currentDate).add(1, 'm').toDate();
}

module.exports = {
    generateRandomNumber,
    generateRandomId,
    generateRandomASCII,
    updateCurrentDateTime
}