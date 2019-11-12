const globalState = {
    destinations: [],
    currentDate: Date.getDate,

    getDestinations: function(){
        return this.destinations;
    },

    setDestinations: function(data){
        destinations = data.slice();
    },

    addNewDestination: function(destination){
        destinations.push(destination)
    },

    getCurrentDate: function(){
        return this.currentDate;
    }
  }

  module.exports = globalState;