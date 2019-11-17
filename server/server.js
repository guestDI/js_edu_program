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
  currentDate: Date.getDate
};

const statusesData = service.getStatuses();
const citiesData = service.getCities();

const generateInitialDestinationsList = () => {
  let destinationsData = service.getAllDestinations();
  initialDestinations = [];

  destinationsData.forEach(element => {
    initialDestinations.push(new Destination(element));
  });

  state.destinations = initialDestinations;
  // globalState.setDestinations(initialDestinations);
};

const updateDestinationTime = () => {
  let updatedDestinations = [];

  updatedDestinations = state.destinations.map((item, i) => {
    let t = moment(Date.getDate)
      .add((7 + i) * 3, 'm')
      .toDate();
    item.setDestinationTime(t);

    return item;
  });

  state.destinations = updatedDestinations;
};

const updateDestinationStatus = () => {
  let minutes = null;

  state.destinations.map(f => {
    let destinationTime = moment(f.dateTime);
    let duration = moment.duration(destinationTime.diff(state.currentDate));
    minutes = duration.asMinutes();

    if (minutes < 15) {
      f.setDestinationStatus(statusesData['closed']);
    } else if (minutes > 15 && minutes < 25) {
      f.setDestinationStatus(statusesData['last_call']);
    } else if (minutes > 25 && minutes < 35) {
      f.setDestinationStatus(statusesData['boarding_now']);
    } else if (minutes > 35) {
      f.setDestinationStatus(statusesData['waiting']);
    }
  });
};

const makeDestinationCanceled = () => {
  let waitingDestinations = state.destinations.filter(
    d => d.status['status_en'] == 'Wait for boarding'
  );
  let random = helpers.generateRandomNumber(waitingDestinations.length - 1, 0);
  let changedDestination = null;
  let indexOfDestination = null;

  if (waitingDestinations.length > 0) {
    changedDestination = waitingDestinations[random];
    changedDestination.status = statusesData['canceled'];
    changedDestination.dateTime = null;
  }

  indexOfDestination = state.destinations.findIndex(
    d => d.id === changedDestination.id
  );

  state.destinations.splice(indexOfDestination, 1, changedDestination);
};

const init = () => {
  generateInitialDestinationsList();
  updateDestinationTime();
  updateDestinationStatus();
};

const createNewDestination = () => {
  let random = helpers.generateRandomNumber(citiesData.length - 1, 0);
  let numberOfFlights = helpers.generateRandomNumber(3, 1);
  let random_ascii = helpers.generateRandomASCII();
  let destinationFlights = [];
  let newFlightDate = moment(state.currentDate)
    .add(70, 'm')
    .toDate();

  for (let i = 0; i <= numberOfFlights; i++) {
    let ascii = helpers.generateRandomNumber(90, 65);
    destinationFlights.push(`${String.fromCharCode(ascii)}${i}${ascii}${i}`);
  }

  let newDestination = {
    id: helpers.generateRandomId(),
    destination_ru: citiesData[random].destination_ru,
    destination_en: citiesData[random].destination_en,
    destination_ch: citiesData[random].destination_ch,
    dateTime: newFlightDate,
    gate: `${random_ascii}${random + 1}`,
    gate_time: `${random + 2} min`,
    status: statusesData.waiting,
    flights: destinationFlights
  };

  return new Destination(newDestination);
};

function setGlobalTimer() {
  state.currentDate = helpers.updateCurrentDateTime(state.currentDate);
  updateDestinationStatus();
  state.destinations.push(createNewDestination());

  setTimeout(setGlobalTimer, 7000);
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
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  if (pathName === '/destinations' || pathName === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(JSON.stringify(state.destinations));
  } else if (pathName === '/statuses') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(JSON.stringify(service.getStatuses()));
  } else if (pathName === '/destination' && id < state.destinations.length) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(JSON.stringify(service.getDestinationById(state.destinations, id)));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end('URL not found');
  }
});

server.listen(serverConfig.PORT, serverConfig.HOSTNAME, () => {
  console.log(
    // eslint-disable-next-line prettier/prettier
    'Server running at http://' + serverConfig.HOSTNAME + ':' + serverConfig.PORT + '/'
  );
});