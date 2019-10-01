import * as actions from './listView.js';
import data from './data/destinations.json';

function stopTimer(e) {
    if((e.key=='ctrl' || e.keyCode==17)){
        console.log('stop');
    }
}

const setupEventListeners = function(){      
    document.addEventListener('keydown', stopTimer);     
}

window.onload = function() {
    const parentRoot = document.querySelectorAll('.schedule-section');
    parentRoot[0].insertAdjacentHTML('afterbegin', actions.renderItems(data).join(''))
    setupEventListeners();
}