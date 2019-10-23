import moment from 'moment';
import View from './View';
import Model from './Model';

const presenter = (function(flightModel, flightView){
    const state = {
        currentDate: Date.getDate,
        destinations: [],
        changedFlights: [],
        current_secondary_lng: 'en',
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

    const checkNewStateForNewDestination = (newState, prevState) => {
        let diff = [];

        if(newState.length != prevState.length){
            diff = newState.filter(({id}) => !prevState.find(o => o.id == id));        
        }      
        return diff;
    }

    const checkNewStateForChanges = (newState, prevState) => {
        let diff = [];
        diff = newState.filter(({id, status}) => prevState.find(o => o.id == id && o.status['status_ru'] != status['status_ru']));        
        return diff;
    }

    const changeStatus = changedDestinations => {
        let destinations = flightView.returnDestinationRecords();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = changedDestinations.find(obj => obj.id == id);
            if(obj){
                let secondaryLng = state.current_secondary_lng === 'en' ? obj.status["status_en"] : obj.status["status_ch"]
                d.changeStatus(obj.status["status_ru"], secondaryLng);

                if(obj.status['status_en'] == 'Canceled'){
                    d.styleCanceledDeparture();
                } 
            }
        })
    }

    const moveRecordToClosed = changedDestinations => {
        let destinations = flightView.returnDestinationRecords();
        let el = null;

        changedDestinations.forEach(d => {
            if(d.status['status_ru'] == 'Посадка завершена'){
                el = destinations.find(destination => destination.getElementId() == d.id)
                if(el){
                    el.collapseDestinationRecord()
                    setTimeout(() => el.printClosedToTheDom(), 700)
                    setTimeout(() => el.styleDeparuredFlight(), 800);
                }
            }
        })
    }

    const printInitialListOfDestinations = data => {
        if(data.length){
            data.forEach(d => {
                let destination = flightView.createDestination(d);

                destination.printToTheDom(d.status['status_en']);
                if(d.status['status_en'] == 'Canceled'){
                    destination.styleCanceledDeparture();
                } 
            })
        }
    }

    const printNewDestination = data => {
        if(data.length){
            data.forEach(d => {
                let destination = flightView.createDestination(d);

                let secondaryLng = state.current_secondary_lng === 'en' ? "status_en" : "status_ch"
                destination.printNewDestination(d.status[secondaryLng]);
                if(d.status['status_en'] == 'Canceled'){
                    destination.styleCanceledDeparture();
                } 
            })
        }
    }

    const setGlobalTimer = () => {
        flightModel.getDestinations()
            .then(r => {
                let newDestinations = checkNewStateForNewDestination(r, state.destinations);
                let changedDestinations = checkNewStateForChanges(r, state.destinations);       

                if(newDestinations.length > 0){
                    printNewDestination(formatDepartureTime(newDestinations));       
                    
                    state.destinations = r.slice();
                } 
                
                if (changedDestinations.length > 0){
                    changeStatus(changedDestinations)
                    moveRecordToClosed(changedDestinations)                    

                    state.destinations = r.slice();
                }    
                
                
            })

        setTimeout(setGlobalTimer, 3000);
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
        let destinations = flightView.returnDestinationRecords();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = state.destinations.find(obj => obj.id == id);
            d.changeDestinationLanguage(obj[lng.destination_lng]);
            d.changeStatusLanguage(obj.status[lng.status_lng])
        })

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
                    printInitialListOfDestinations(formatDepartureTime(resultState));

                    state.destinations = resultState;
                })

                setLangTimeout();
                setGlobalTimer();
                
        }
    }    
    
})(Model, View);

window.onload = function(){
    presenter.init();                 
}    