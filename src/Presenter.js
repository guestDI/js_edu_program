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
        // let props = ['id', 'status_en'];
        let diff = [];
        diff = newState.filter(({id, status_ru}) => prevState.find(o => o.id == id && o.status_ru != status_ru));        
        return diff;
    }

    const changeStatus = changedDestinations => {
        let destinations = flightView.returnDestinationRecords();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = changedDestinations.find(obj => obj.id == id);
            if(obj){
                let secondaryLng = state.current_secondary_lng === 'en' ? obj["status_en"] : obj["status_ch"]
                d.changeStatus(obj["status_ru"], secondaryLng);
            }
            
        })
    }

    const moveRecordToClosed = (changedDestinations) => {
        let destinations = flightView.returnDestinationRecords();
        let el = null;

        changedDestinations.forEach(d => {
            if(d.status_ru == 'Посадка завершена'){
                el = destinations.find(destination => destination.getElementId() == d.id)
                if(el){
                    el.destroy()
                    setTimeout(() => el.printClosedToTheDom(), 1000)
                    
                }
            }
        })

        // console.log(el)
    }

    const setGlobalTimer = () => {
        // let destinations = flightView.returnDestinationRecords();

        flightModel.getDestinations()
            .then(r => {
                let results = checkNewStateForNewDestination(r, state.destinations);
                let changedDestinations = checkNewStateForChanges(r, state.destinations);
                if(results.length > 0){
                    flightView.createDestination(formatDepartureTime(results));
                // checkNewStateForChanges(r, initialState)
                // checkNewStateForNewDestination(r, state.flights)
                // compareFlightStates(initialState, r)
                
                    state.destinations = r.slice();
                } else if (changedDestinations.length > 0){
                    changeStatus(changedDestinations)
                    moveRecordToClosed(changedDestinations)
                    // console.log(changedDestinations)

                    state.destinations = r.slice();
                }
                
                

                // if(changedDestinations.length > 0 ){
                    // destinations.forEach(d => {
                    //     let id = d.getElementId();
                    //     let obj = state.destinations.find(obj => obj.id == id);
                    //     d.changeStatus(obj[status_ru]);
                    // })
                // }

            })

        // flightView.destroy(5)    
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
        let destinations = flightView.returnDestinationRecords();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = state.destinations.find(obj => obj.id == id);
            d.changeDestinationLanguage(obj[lng.destination_lng]);
            d.changeStatusLanguage(obj[lng.status_lng])
        })
        
        // flightView.changeDestinationLanguage())

        // flightView.renderStatusOnSecondaryLanguage(state.flights, lng.status_lng);

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
                    flightView.printListOfDestinations(formatDepartureTime(resultState));

                    state.destinations = resultState;
                })

                // setLangTimeout();
                setGlobalTimer();
        }
    }    
    
})(Model, View);

window.onload = function(){
    presenter.init();                 
}    