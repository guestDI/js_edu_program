import * as actions from './listView.js';
import * as headerActions from './headerView.js';
import { getDestinations, getStatusByName } from './controller.js';
import moment from 'moment';

let timeOut = null;
let dateChangeTimeOut = null;

const state = {
    currentDate: Date.getDate,
    destinations: []
}

const setDestinationsTime = () => {
    let initial = getDestinations().slice();
    let updated = [];

    initial.map((item, i) => {
        let t = moment(state.currentDate).add((7 + i)*3, 'm').toDate();
        item.time = t;
        updated.push(item);
    })

    return updated;
}

const updateDestinationStatus = () => {

}

const getCurrentDate = () => {
    return moment(state.currentDate).format("DD.MM.YYYY")    
}

const formatCurrentTime = () => {
    return moment(state.currentDate).format("HH:mm")    
}

const addMinutes = () => {
    let current = state.currentDate;

    state.currentDate = moment(current).add(1, 'm').toDate();
    headerActions.renderCurrentTime(formatCurrentTime());
    headerActions.renderCurrentDate(getCurrentDate());
    dateChangeTimeOut = setTimeout(addMinutes, 3000);
}

const checkTime = () => {
    let minutes = null;
    let initial = [];

    initial = state.destinations.map((item, i) => {
        let destinationTime = moment(item.time);
        let duration = moment.duration(destinationTime.diff(state.currentDate));
        minutes = duration.asMinutes();
        if(minutes < 15){
            let status = getStatusByName("closed");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch
        } else if(minutes < 25){
            let status = getStatusByName("last_call");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch
        } else if(minutes < 35){
            let status = getStatusByName("boarding_now");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch
        } else if(minutes < 40){
            let status = getStatusByName("waiting");
            item.status_ru = status.status_ru
            item.status_en = status.status_en
            item.status_ch = status.status_ch
        }        

        return item;
        
    })

    // console.log(initial)
    actions.removeChildFromDOM();
    const parentRoot = document.querySelectorAll('.schedule-section');
    parentRoot[0].insertAdjacentHTML('afterbegin', actions.renderItems(initial).join(''))
}

function setTimer() {
    checkTime();

    timeOut = setTimeout(setTimer, 3000);
}

function stopTimer(e) {
    if((e.key=='ctrl' || e.keyCode==17)){
        clearTimeout(timeOut);
        clearTimeout(dateChangeTimeOut);
        console.log('Timers have been stopped')
    }
}

const setupEventListeners = function(){      
    document.addEventListener('keydown', stopTimer);     
}

window.onload = function() {
    const parentRoot = document.querySelectorAll('.schedule-section');
    state.destinations = setDestinationsTime().slice();
    parentRoot[0].insertAdjacentHTML('afterbegin', actions.renderItems(state.destinations).join(''))
    setupEventListeners();
    actions.setStatusStyle();
    headerActions.renderCurrentDate(getCurrentDate());
    headerActions.renderCurrentTime(formatCurrentTime());
    addMinutes();
    setTimer();
}