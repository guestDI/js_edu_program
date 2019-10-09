import moment from 'moment';
import View from './View';
import Model from './Model';

const presenter = (function(flightModel, flightView){
    const state = {
        currentDate: Date.getDate,
        flights: [],
        changedFlights: [],
        current_secondary_lng: 'destination_ch',
        timeOut: null
    }

    const formattedCurrentDateTime = function(format) {
        return moment(state.currentDate).format(format)    
    }

    const formatFlightTime = flights => {
        let updated = flights.map(f => {
            const initialTime = f.dateTime          
            f.dateTime = moment(initialTime).format("HH:mm")
            
            return f;
        })

        return updated;
    }

    const objectsEqual = (o1, o2) =>
            Object.keys(o1).length === Object.keys(o2).length 
                && Object.keys(o1).every(p => o1[p] === o2[p]);

    const setGlobalTimer = () => {
        const initialState = state.flights.slice();
        flightModel.getDestinations()
            .then(r => {
                let state = r.slice()
                // compareFlightStates(initialState, r)
                // objectsEqual(state.flights, r)
                // flightView.renderItems(formatFlightTime(state))

                // state.flights = state;
            })

        flightView.destroy(5)    
        setTimeout(setGlobalTimer, 2000);
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
                    flightView.renderItems(formatFlightTime(resultState));
                    flightView.setGateStyle(resultState);

                    state.flights = resultState;
                    setLangTimeout();
                })

                // setGlobalTimer();
        }
    }    
    
})(Model, View);

window.onload = function(){
    presenter.init();                 
}    