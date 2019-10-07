import moment from 'moment';

const DOMStrings = {
    destinationRowsSelector: '.destination-block-wrapper',
    gateSelector: '.gate-block-wrapper'
};


const renderFilghts = flights => {
    let html = [];

    flights.map(item => {
        html.push(`<span>${item}</span>`);
    })

    return html;
}

const renderItem = item => {
    return `
        <li class="destination-block-wrapper data-item-id=${item.id}">
            <div class="destination-block time sub-text_color">
                <time>${moment(item.time).format("HH:mm")}</time>
            </div>
            <div class="destination-block flights-destination">
                <div class="left city">
                <span>${item.destination_ru}</span>
                </div>
                <div class="flip">
                    <span class="sub-text_color sub-city sub-text_size flip-text" data-content=${item.destination_ch}>${item.destination_en}</span>
                </div>
                <div class="flights">
                    ${renderFilghts(item.flights).join('')}
                </div>
            </div>
            <div class="destination-block gate-block-wrapper">
                <div class="gate-block">
                    <img class="step" src="images/steps.png" />
                    <span>${item.gate_time}</span>
                </div>
                    <div class="gate-block">
                    <span>${item.gate}</span>
                </div>
            </div>
            <div class="destination-block status">
                <div>
                    <span>${item.status_ru}</span>
                </div>
                <div class="sub-text_color flip">
                    <span class="flip-text" data-content=${item.status_ch}>${item.status_en}</span>
                </div>
            </div>
        </li>
    `
}

export const renderItems = data => {
    let html = [];

    data.map(item => {
        html.push(renderItem(item));
    })

    return (
        html.join('')
    )
}

export const renderClosedDestinations = data => {
    const closedDestinations = document.querySelector('ul.schedule-section_closed');
    removeChildFromClosedDestinations();
    closedDestinations.insertAdjacentHTML('afterbegin', renderItems(data))
}

export const removeChildFromClosedDestinations = () => {
    while (document.querySelector('.schedule-section_closed').hasChildNodes()) {
        document.querySelector('.schedule-section_closed').removeChild(document.querySelector('.schedule-section_closed').lastChild);
      }
}

export const removeChildFromDOM = () => {
    while (document.querySelector('.schedule-section_open').hasChildNodes()) {
        document.querySelector('.schedule-section_open').removeChild(document.querySelector('.schedule-section_open').lastChild);
      }
}

export const renderStatus = (index, status) => {
    const destinationRows = document.querySelectorAll('.destination-block-wrapper');
    
    destinationRows.forEach((item, i) => {
        if(i == index){
            item.querySelector('.status').getElementsByTagName('span')[0].innerHTML = status.status_ru;
            item.querySelector('.status').getElementsByTagName('span')[1].innerHTML = status.status_en;
            item.querySelector('.status').getElementsByTagName('span')[1].setAttribute('data-content', status.status_ch);
        }
    })
}

export const setStatusStyle = () => {
    const destinationRows = document.querySelectorAll(DOMStrings.destinationRowsSelector);
    const statusBlocks = document.querySelectorAll('.status');

    statusBlocks.forEach((item, i) => {
        let status = item.getElementsByTagName("span")[0].innerHTML;

        if(status === "Cancelled" || status === "Отменен"){
            item.classList.add("status_cancelled");
            item.getElementsByTagName("span")[1].style.color = "#ff3333"
            destinationRows[i].getElementsByTagName("time")[0].style.visibility = 'hidden'
        }
    })   
}

export const setGateStyle = (data) => {
    const gate = document.querySelectorAll(DOMStrings.gateSelector);
    
    data.forEach((item, i) => {
        if(item.status_en == "Gate Closed"){
            gate[i].querySelector("img").classList.add("step_closed");
            gate[i].style.color = "#d17d06"
        }
    })   
}