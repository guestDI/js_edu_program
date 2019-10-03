import data from './data/destinations.json';
import statuses from './data/statuses.json';

export const getDestinations = () => {
    return data.slice();
}

export const getStatusByName = status => {
    return statuses[status]
}