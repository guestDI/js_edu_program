const fs = require('fs');
const path = require('path');

const getAllDestinations = () => {
    const json = fs.readFileSync(`${path.join(__dirname, '../data/destinations.json')}`, 'utf-8');
    return JSON.parse(json)
}

const getDestinationById = (data, id) => {
    return data.filter(d => d.id == id);
}

const getStatuses = () => {
    const json = fs.readFileSync(`${path.join(__dirname, '../data/statuses.json')}`, 'utf-8');
    return JSON.parse(json);
}

const getCities = () => {
    const json = fs.readFileSync(`${path.join(__dirname, '../data/cities.json')}`, 'utf-8');
    return JSON.parse(json);
}

module.exports = {
    getAllDestinations,
    getDestinationById,
    getStatuses,
    getCities
}