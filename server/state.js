const state = {
    destinations: [],
    currentDate: Date.getDate,

    getDestinations: function(){
        return destinations;
    },

    setDestinations: function(data){
        destinations = data.slice();
    },

    addDestination: function(destination){
        destinations.push(destination)
    }
  }

  module.exports = state;