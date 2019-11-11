const routesHandler = (req, res, state) => {
    console.log(state)
    const { url } = req;

    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader( 'Content-Type', 'text/html');
    
    // const id = url.query.id;   
       
    if(url === '/destinations' || url === '/'){
      res.end(JSON.stringify(state.destinations));
    } 
    // else if (pathName === '/destination' && id < state.destinations.length){
    //   res.end(JSON.stringify(service.getDestinationById(state.destinations, id)));
    // }
    else {
      res.writeHead(404, { 'Content-Type': 'text/html'});
      res.end('URL not found');
    }      
}

module.exports = routesHandler;