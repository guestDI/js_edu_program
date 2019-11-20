const globalState = {
    destinations: [],
    currentDate: Date.getDate,

    getDestinations: function () {
        return this.destinations;
    },

    setDestinations: function (data) {
        this.destinations = data.slice();
    },

    addNewDestination: function (destination) {
        this.destinations.push(destination)
    },

    getCurrentDate: function () {
        return this.currentDate;
    }
}

module.exports = globalState;