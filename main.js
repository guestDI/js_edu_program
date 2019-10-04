import * as actions from './listView.js';
import * as headerActions from './headerView.js';
import { getDestinations, getStatusByName } from './controller.js';
import moment from 'moment';

let timeOut = null;

const state = {
    currentDate: Date.getDate,
    destinations: [],
    closedDestinations: []
}

const setupEventListeners = function(){      
    document.addEventListener('keydown', stopGlobalTimer);     
}

const formatCurrentDate = () => {
    return moment(state.currentDate).format("DD.MM.YYYY")    
}

const formatCurrentTime = () => {
    return moment(state.currentDate).format("HH:mm")    
}

const setDestinationsTime = () => {
    let initial = getDestinations().slice();
    let updatedDestinations = [];

    updatedDestinations = initial.map((item, i) => {
        let t = moment(state.currentDate).add((7 + i)*3, 'm').toDate();
        item.time = t;
        
        return item;
    })

    state.destinations = updatedDestinations.slice();
}

const updateCurrentDateTime = () => {
    const current = state.currentDate;

    state.currentDate = moment(current).add(1, 'm').toDate();
    headerActions.renderCurrentTime(formatCurrentTime());
    headerActions.renderCurrentDate(formatCurrentDate());
}

export const updateListOfClosedDestinations = item => {

    if(state.closedDestinations.length < 5){
        if(!state.closedDestinations.some(d => d.id === item.id)){
            state.closedDestinations.splice(0, 0, item)
        }        
    } else {
        state.closedDestinations.splice(state.closedDestinations.length - 1, 1);
        if(!state.closedDestinations.some(d => d.id === item.id)){
            state.closedDestinations.splice(0, 0, item)
        } 
    }
    
    console.log(state.closedDestinations)
}

const checkTime = () => {
    let minutes = null;
    let initial = [];

    initial = state.destinations.map((item, i) => {
        let destinationTime = moment(item.time);
        let duration = moment.duration(destinationTime.diff(state.currentDate));
        minutes = duration.asMinutes();
        if(minutes < 15 && !(item.status_en == "Canceled")){
            let status = getStatusByName("closed");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch

            updateListOfClosedDestinations(item);


            actions.renderStatus(i, status)
        } else if(minutes < 25 && !(item.status_en == "Canceled")){
            let status = getStatusByName("last_call");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch

            actions.renderStatus(i, status)
        } else if(minutes < 35 && !(item.status_en == "Canceled")){
            let status = getStatusByName("boarding_now");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch

            actions.renderStatus(i, status)
        } else if(minutes < 40 && !(item.status_en == "Canceled")){
            let status = getStatusByName("waiting");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch

            actions.renderStatus(i, status)
        }        

        return item;
        
    })

    actions.setGateStyle(initial);
}

function setGlobalTimer() {
    updateCurrentDateTime();
    checkTime();
    actions.setStatusStyle();

    timeOut = setTimeout(setGlobalTimer, 3000);
}

function stopGlobalTimer(e) {
    if((e.key=='ctrl' || e.keyCode==17)){
        clearTimeout(timeOut);
        console.log('Timer has been stopped')
    }
}

//Initial state of application
window.onload = function() {
    setupEventListeners();
    headerActions.renderCurrentDate(formatCurrentDate());
    headerActions.renderCurrentTime(formatCurrentTime());

    setDestinationsTime();
    const parentRoot = document.querySelectorAll('.schedule-section');
    parentRoot[0].insertAdjacentHTML('afterbegin', actions.renderItems(state.destinations).join(''))
    
    actions.setStatusStyle();    
    // setGlobalTimer();
}