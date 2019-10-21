import fs from 'fs';
import http from 'http';
import path from 'path';
import url from 'url';
import moment from 'moment';

const hostname = '127.0.0.1';
const port = 5000;

function Destination(id, destination_ru, destination_en, destination_ch, dateTime, gate, gate_time, status_ru, status_en, status_ch, flights){
  this.id = id;
  this.destination_ru = destination_ru;
  this.destination_en = destination_en;
  this.destination_ch = destination_ch;
  this.dateTime = dateTime;
  this.gate = gate;
  this.gate_time = gate_time;
  this.status_ru = status_ru;
  this.status_en = status_en;
  this.status_ch = status_ch;
  this.flights = flights;
}

const destinationsJson = fs.readFileSync(`${path.join(__dirname, '../data/destinations.json')}`, 'utf-8');
const statusesJson = fs.readFileSync(`${path.join(__dirname, '../data/statuses.json')}`, 'utf-8');
const citiesJson = fs.readFileSync(`${path.join(__dirname, '../data/cities.json')}`, 'utf-8');
const destinationsData = JSON.parse(destinationsJson);
const statusesData = JSON.parse(statusesJson);
const citiesData = JSON.parse(citiesJson);

const state = {
  destinations: destinationsData.slice(),
  currentDate: Date.getDate
}

const generateRandomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getDestinationById = id => {
  return destinationsData.filter(d => d.id == id);
}

const setDestinationsTime = () => {
  let updatedDestinations = [];

  updatedDestinations = state.destinations.map((item, i) => {
      let t = moment(Date.getDate).add((7 + i)*3, 'm').toDate();
      item.dateTime = t;
      
      return item;
  })

  state.destinations = updatedDestinations;
}

const checkFlightStatus = () => {
    let minutes = null;

    state.destinations.map((f, i) => {
        let destinationTime = moment(f.dateTime);
        let duration = moment.duration(destinationTime.diff(state.currentDate));
        minutes = duration.asMinutes();
        
        if(minutes < 15 && !(f.status_en == "Canceled")){
          f.status_ru = statusesData["closed"].status_ru
          f.status_en = statusesData["closed"].status_en
          f.status_ch = statusesData["closed"].status_ch

        } else if(minutes < 25 && !(f.status_en == "Canceled")){
          f.status_ru = statusesData["last_call"].status_ru
          f.status_en = statusesData["last_call"].status_en
          f.status_ch = statusesData["last_call"].status_ch

        } else if(minutes < 35 && !(f.status_en == "Canceled")){
          f.status_ru = statusesData["boarding_now"].status_ru
          f.status_en = statusesData["boarding_now"].status_en
          f.status_ch = statusesData["boarding_now"].status_ch

        } else if(minutes < 40 && !(f.status_en == "Canceled")){
          f.status_ru = statusesData["waiting"].status_ru
          f.status_en = statusesData["waiting"].status_en
          f.status_ch = statusesData["waiting"].status_ch
        }   
    })
}

const updateCurrentDateTime = () => {
  const current = state.currentDate;

  state.currentDate = moment(current).add(1, 'm').toDate();
}

const createNewRecord = () => {
  let random = Math.floor(Math.random() * Math.floor(citiesData.length));
  const city = citiesData[random]
  let random_ascii = String.fromCharCode(generateRandomNumber(90, 65));
  let numberOfFlights = generateRandomNumber(3, 1);
  let destinationFlights = [];
  let waitingStatus = statusesData.waiting;
  let randomId = '_' + Math.random().toString(36).substr(2, 9);
  let newFlightDate = moment(state.currentDate).add(70, 'm').toDate()

  for(let i=0; i <= numberOfFlights; i++){
    let ascii = generateRandomNumber(90, 65)
    destinationFlights.push(`${String.fromCharCode(ascii)}${i}${ascii}${i}`)
  }

  let dest = new Destination(randomId, city.destination_ru, city.destination_en, city.destination_ch, newFlightDate, `${random_ascii}${random+1}`,
                             `${random + 2} min`, waitingStatus.status_ru, waitingStatus.status_en, waitingStatus.status_ch, destinationFlights)

 return dest;
}

function setGlobalTimer() {
  state.destinations.push(createNewRecord());
  // console.log('ping')
  setTimeout(setGlobalTimer, 10000);
}

function setStatusTimer(){
    updateCurrentDateTime();
    checkFlightStatus();

    setTimeout(setStatusTimer, 3000);
}

// setGlobalTimer();
// setStatusTimer()
setDestinationsTime();
checkFlightStatus();

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;   
       
    if(pathName === '/destinations' || pathName === '/'){
      res.writeHead(200, { 'Content-Type': 'text/html'});
      res.end(JSON.stringify(state.destinations));
    } 
    else if (pathName === '/statuses'){
      res.writeHead(200, { 'Content-Type': 'text/html'});
      res.end(statusesJson);
    } 
    else if (pathName === '/destination' && id < state.destinations.length){
      res.writeHead(200, { 'Content-Type': 'text/html'});
      res.end(JSON.stringify(getDestinationById(id)));
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/html'});
      res.end('URL not found');
    }    
    
  });

  server.listen(port, hostname, () => {
    console.log('Server running at http://'+ hostname + ':' + port + '/');
  });