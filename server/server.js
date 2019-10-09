import fs from 'fs';
import http from 'http';
import path from 'path';
import url from 'url';
import moment from 'moment';

const hostname = '127.0.0.1';
const port = 5000;

const destinationsJson = fs.readFileSync(`${path.join(__dirname, '../data/destinations.json')}`, 'utf-8');
const statusesJson = fs.readFileSync(`${path.join(__dirname, '../data/statuses.json')}`, 'utf-8');
let destinationsData = JSON.parse(destinationsJson);
const statusesData = JSON.parse(statusesJson);

const state = {
  destinations: destinationsData.slice(),
  currentDate: Date.getDate
}

const getDestinationById = id => {
  return destinationsData.filter(d => d.id == id);
}

const setDestinationsTime = () => {
  let initial = state.destinations.slice();
  let updatedDestinations = [];

  updatedDestinations = initial.map((item, i) => {
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

function setGlobalTimer() {
  updateCurrentDateTime();
  checkFlightStatus();

  setTimeout(setGlobalTimer, 5000);
}

const server = http.createServer((req, res) => {
 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    setDestinationsTime();
    //setGlobalTimer();
       
    if(pathName === '/destinations' || pathName === '/'){
      res.writeHead(200, { 'Content-Type': 'application/json'});
      res.end(JSON.stringify(state.destinations));
    } 
    else if (pathName === '/statuses'){
      res.writeHead(200, { 'Content-Type': 'application/json'});
      res.end(statusesJson);
    } 
    else if (pathName === '/destination' && id < state.destinations.length){
      res.writeHead(200, { 'Content-Type': 'application/json'});
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