class Destination {
    constructor(element) {
        this.id = element.id;
        this.destination_ru = element.destination_ru;
        this.destination_en = element.destination_en;
        this.destination_ch = element.destination_ch;
        this.destination_de = element.destination_de;
        this.dateTime = element.dateTime;
        this.gate = element.gate;
        this.gate_time = element.gate_time;
        this.status = element.status;
        this.flights = element.flights;
    }

    set destinationTime(time) {
        if (!isNaN(Date.parse(time))) {
            this.dateTime = time;
        }

    }

    set destinationStatus(status) {
        this.status = status;
    }
}

module.exports = Destination;