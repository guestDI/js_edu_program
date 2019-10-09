import fs from 'fs';
import http from 'http';
import path from 'path';
import url from 'url';

const hostname = '127.0.0.1';
const port = 5000;

const destinationsJson = fs.readFileSync(`${path.join(__dirname, '../data/destinations.json')}`, 'utf-8');
const statusesJson = fs.readFileSync(`${path.join(__dirname, '../data/statuses.json')}`, 'utf-8');
const destinationsData = JSON.parse(destinationsJson);
const statusesData = JSON.parse(statusesJson);

const getDestinationById = id => {
  return destinationsData.filter(d => d.id == id);
}

const server = http.createServer((req, res) => {

  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
       
    if(pathName === '/destinations' || pathName === '/'){
      res.writeHead(200, { 'Content-Type': 'application/json'});
      res.end(destinationsJson);
    } 
    else if (pathName === '/statuses'){
      res.writeHead(200, { 'Content-Type': 'application/json'});
      res.end(statusesJson);
    } 
    else if (pathName === '/destination' && id < destinationsData.length){
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