import moment from 'moment';
import UIController from './UIController';
import flightsController from './FlightsController';
import data from '../data/destinations.json';

const appController = (function(FlightsCtrl, UICtrl){

    const state = {
        currentDate: Date.getDate,
        flights: [],
        current_secondary_lng: 'eng',
        timeOut: null
    }

    const getDestinations = () => {
        fetch('http://localhost:5000/destinations')
        .then(response => response.json())
        .then(data => {
            state.flights = data;    
            UICtrl.renderItems(data);   
            setLanguageTimer();              
        })
    }    

    const formattedDateTime = function(format) {
        return moment(state.currentDate).format(format)    
    }

    const changeCurrentSecondaryLanguage = () => {
        let destinationLanguage, statusLanguage = null;

        if(state.current_secondary_lng === 'eng') {
            destinationLanguage = 'destination_en';
            statusLanguage = 'status_en';
            state.current_secondary_lng = 'ch';
        } else if(state.current_secondary_lng === 'ch'){
            destinationLanguage = 'destination_ch';
            statusLanguage = 'status_ch';
            state.current_secondary_lng = 'eng';
        }
        
        return {
            destinationLanguage,
            statusLanguage
        };
    }


    function setLanguageTimer() {
        const lng = changeCurrentSecondaryLanguage();
        // UICtrl.renderStatusOnSecondaryLanguage(state.flights, lng.statusLanguage);    
        // UICtrl.removeScondaryCity(state.flights, lng.destinationLanguage);  
  
        state.timeOut = setTimeout(setLanguageTimer, 5000);
    }

    return {
        init: function() {            
            window.onload = function(){
                console.log("Application has started");
                UICtrl.renderCurrentDate(formattedDateTime("DD.MM.YYYY"))
                UICtrl.renderCurrentTime(formattedDateTime("HH:mm"))
                getDestinations();                       
            }            
        }
    }


})(flightsController, UIController);

appController.init();