import * as actions from './listView.js';
import data from './data/destinations.json';

window.onload = function() {
    const parentRoot = document.querySelectorAll('.schedule-section');
    // console.log(parentRoot);
    parentRoot[0].insertAdjacentHTML('afterbegin', actions.renderItems(data).join(''))
}