/* eslint-disable no-plusplus */
/* eslint-disable dot-notation */
const http = require('http');
const url = require('url');
const moment = require('moment');
const serverConfig = require('./config');
const helpers = require('./helpers');
const service = require('./service');
const Destination = require('./model');
// const globalState = require('./state');

const state = {
  destinations: [],
  currentDate: Date.getDate,
};

const statusesData = service.getStatuses();
const citiesData = service.getCities();

const generateInitialDestinationsList = () => {
  const destinationsData = service.getAllDestinations();
  let initialDestinations = [];

  initialDestinations = destinationsData.map((element) => {
    return new Destination(element);
  });

  state.destinations = initialDestinations;
  // globalState.setDestinations(initialDestinations);
};

const updateDestinationTime = () => {
  let updatedDestinations = [];

  updatedDestinations = state.destinations.map((item, i) => {
    // eslint-disable-next-line no-param-reassign
    item.destinationTime = moment(Date.getDate)
      .add((7 + i) * 3, 'm')
      .toDate();

    return item;
  });

  state.destinations = updatedDestinations;
};

const updateDestinationStatus = () => {
  let minutes = null;

  // eslint-disable-next-line array-callback-return
  state.destinations.map((f) => {
    const destinationTime = moment(f.dateTime);
    const duration = moment.duration(destinationTime.diff(state.currentDate));
    minutes = duration.asMinutes();

    if (minutes <= 15) {
      f.destinationStatus = statusesData['closed'];
    } else if (minutes > 15 && minutes <= 25) {
      f.destinationStatus = statusesData['last_call'];
    } else if (minutes > 25 && minutes <= 35) {
      f.destinationStatus = statusesData['boarding_now'];
    } else {
      f.destinationStatus = statusesData['waiting'];
    }
  });
};

const makeDestinationCanceled = () => {
  const waitingDestinations = state.destinations.filter(
    (d) => d.status['status_en'] === 'Wait for boarding'
  );
  const random = helpers.generateRandomNumber(waitingDestinations.length - 1, 0);
  let changedDestination = null;
  let indexOfDestination = null;

  if (waitingDestinations.length > 0) {
    changedDestination = waitingDestinations[random];
    changedDestination.status = statusesData['canceled'];
  }

  indexOfDestination = state.destinations.findIndex((d) => d.id === changedDestination.id);

  state.destinations.splice(indexOfDestination, 1, changedDestination);
};

const init = () => {
  generateInitialDestinationsList();
  updateDestinationTime();
  updateDestinationStatus();
};

const createNewDestination = () => {
  const random = helpers.generateRandomNumber(citiesData.length - 1, 0);
  const numberOfFlights = helpers.generateRandomNumber(3, 1);
  const randomAscii = helpers.generateRandomASCII();
  const destinationFlights = [];
  const newFlightDate = moment(state.currentDate)
    .add(70, 'm')
    .toDate();

  for (let i = 0; i <= numberOfFlights; i++) {
    const ascii = helpers.generateRandomNumber(90, 65);
    destinationFlights.push(`${String.fromCharCode(ascii)}${i}${ascii}${i}`);
  }

  const newDestination = {
    id: helpers.generateRandomId(),
    destination_ru: citiesData[random].destination_ru,
    destination_en: citiesData[random].destination_en,
    destination_ch: citiesData[random].destination_ch,
    destination_de: citiesData[random].destination_de,
    dateTime: newFlightDate,
    gate: `${randomAscii}${random + 1}`,
    gate_time: `${random + 2} min`,
    status: statusesData.waiting,
    flights: destinationFlights,
  };

  return new Destination(newDestination);
};

function setGlobalTimer() {
  state.currentDate = helpers.updateCurrentDateTime(state.currentDate);
  updateDestinationStatus();
  state.destinations.push(createNewDestination());

  setTimeout(setGlobalTimer, 2000);
}

function setTimerToMakeDestinationCanceled() {
  makeDestinationCanceled();

  setTimeout(setTimerToMakeDestinationCanceled, 14000);
}

init();
// setGlobalTimer();
// setTimerToMakeDestinationCanceled();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  const pathName = url.parse(req.url, true).pathname;
  const {
    id
  } = url.parse(req.url, true).query;

  if (pathName === '/destinations' || pathName === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(JSON.stringify(state.destinations));
  } else if (pathName === '/statuses') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(JSON.stringify(service.getStatuses()));
  } else if (pathName === '/destination' && id < state.destinations.length) {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(JSON.stringify(service.getDestinationById(state.destinations, id)));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('URL not found');
  }
});

server.listen(serverConfig.PORT, serverConfig.HOSTNAME);