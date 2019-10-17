import moment from 'moment';
import View from './View';
import Model from './Model';

const presenter = (function(flightModel, flightView){
    const state = {
        currentDate: Date.getDate,
        destinations: [],
        changedFlights: [],
        current_secondary_lng: 'destination_ch',
        timeOut: null
    }

    const formattedCurrentDateTime = function(format) {
        return moment(state.currentDate).format(format)    
    }

    const formatDepartureTime = destinations => {
        let updated = destinations.map(f => {
            const initialTime = f.dateTime          
            f.dateTime = moment(initialTime).format("HH:mm")
            
            return f;
        })

        return updated;
    }

    const checkNewStateForNewFlight = (newState, prevState) => {
        return newState.filter(item => !prevState.some(other => item.id == other.id));
    }

    const checkNewStateForChanges = (newState, prevState) => {
        let props = ['id', 'status_en'];

        console.log(newState, 'newstate')
        console.log(prevState, 'prevstate')
    }

    const setGlobalTimer = () => {
        flightModel.getDestinations()
            .then(r => {
                let results = checkNewStateForNewFlight(r, state.destinations)
                
                // checkNewStateForChanges(r, initialState)
                // checkNewStateForNewFlight(r, state.flights)
                // compareFlightStates(initialState, r)
                // flightView.renderItems(formatFlightTime(results))
                // flightView.renderClosedItem(results[0])

                state.flights = r.slice();
            })

        flightView.destroy(5)    
        flightView.setStyleOfStatusContainer();
        setTimeout(setGlobalTimer, 5000);
    }

    const changeSecondaryLanguage = () => {
        let updated = "";
        let newLanguage = {};

        if(state.current_secondary_lng == "en"){
            updated = "ch";
            newLanguage = {
                destination_lng: "destination_ch",
                status_lng: "status_ch"
            }
        } else {
            updated = "en";
            newLanguage = {
                destination_lng: "destination_en",
                status_lng: "status_en"
            }
        }

        state.current_secondary_lng = updated;

        return newLanguage;
    }

    const setLangTimeout = () => {
        let lng = changeSecondaryLanguage();
        flightView.renderCityOnSecondaryLanguage(state.flights, lng.destination_lng);
        flightView.renderStatusOnSecondaryLanguage(state.flights, lng.status_lng);

        setTimeout(setLangTimeout, 5000)
    }

    return {
        init: function(){
            console.log("Application has started")
            flightModel.getDestinations()
                .then(r => {
                    let resultState = r.slice()
                    flightView.renderCurrentDate(formattedCurrentDateTime("DD.MM.YYYY"))
                    flightView.renderCurrentTime(formattedCurrentDateTime("HH:mm"))
                    flightView.printInitialListOfDestinations(formatDepartureTime(resultState));

                    state.destinations = resultState;
                    // setLangTimeout();
                })

                // setGlobalTimer();
        }
    }    
    
})(Model, View);

window.onload = function(){
    presenter.init();                 
}    