const UIController = (function(){
    const DOMStrings = {
        destinationRowSelector: '.destination-block-wrapper',
        gateSelector: '.gate-block-wrapper',
        gateImageSelector: '.gate-block > img',
        currentDateSelector: '.current-date-block > div.date > time',
        currentTimeSelector: '.current-date-block > div.time > time',
        closedFlightsSelector: '.schedule-section_closed',
        openFlightsSelector: '.schedule-section_open',
        subCityLanguageSelector: '.sub-city',
        subCityLanguageSelectorContainer: '.flip',
        statusSelector: '.status',
        primaryStatusSelector: '.status > .primary_status > span',
        secondaryStatusSelector: '.status > .sub-text_color > span'
    };

    const destinationRecords = [];     

    const printFilghts = flights => {
        let html = [];
    
        flights.map(item => {
            html.push(`<span>${item}</span>`);
        })
    
        return html.join('');
    }

    function destinationRecord(destination) {
        const wrapperElement = document.createElement('li');
        const template = getDestinationHtmlTemplate(destination);

        wrapperElement.className = 'destination-block-wrapper';
        wrapperElement.id = destination.id;
        wrapperElement.innerHTML = template;

        const element = wrapperElement;

        return {
            getElementId: function(){
                return element.getAttribute('id');
            },

            changeFlightStatus: function(status){
                element.querySelector(DOMStrings.secondaryLanguageSelector).innerHTML = status;
            },

            printToTheDom: function(section){
                document.querySelector(section).appendChild(element);
            },

            printClosedToTheDom: function(){
                document.querySelector(DOMStrings.closedFlightsSelector).appendChild(element);
                setTimeout(() => element.classList.add('show'), 500)
            },

            printNewDestination: function(section){
                element.classList.add('hide')
                document.querySelector(section).appendChild(element);
                setTimeout(() => element.classList.add('show'), 0)
            },

            styleDeparuredFlight: function(){
                element.querySelector(DOMStrings.gateImageSelector).classList.add("step_closed");
                element.querySelector(DOMStrings.gateSelector).style.color = "#d17d06"
            },

            styleCanceledDeparture: function(){                
                element.querySelector(DOMStrings.statusSelector).classList.add("status_cancelled");
                element.querySelector(DOMStrings.statusSelector).getElementsByTagName("span")[1].style.color = "#ff3333"
                element.getElementsByTagName("time")[0].style.visibility = 'hidden'
            },

            changeDestinationLanguage: function(destination){
                element.querySelector(DOMStrings.subCityLanguageSelector).innerHTML = destination;
            },

            changeStatusLanguage: function(status){
                element.querySelector(DOMStrings.secondaryStatusSelector).innerHTML = status;
            },

            changeStatus: function(status_ru, secondaryStatus){
                element.querySelector(DOMStrings.primaryStatusSelector).innerHTML = status_ru;
                element.querySelector(DOMStrings.secondaryStatusSelector).innerHTML = secondaryStatus;
            },

            destroy: function(){
                element.classList.add('hide');
                // element.remove();
            },
        };
    }

    function getDestinationHtmlTemplate({dateTime, destination_ru, destination_en, flights, gate_time, gate, status_ru, status_en}){
        return `<div class="destination-block time sub-text_color">
                    <time>${dateTime}</time>
                </div>
                <div class="destination-block flights-destination">
                    <div class="left city">
                    <span>${destination_ru}</span>
                    </div>
                    <div class="flip">
                        <span class="sub-text_color sub-city sub-text_size" >${destination_en}</span>
                    </div>
                    <div class="flights">
                        ${printFilghts(flights)}
                    </div>
                </div>
                <div class="destination-block gate-block-wrapper">
                    <div class="gate-block">
                        <img class="step" src="images/steps.png" />
                        <span>${gate_time}</span>
                    </div>
                        <div class="gate-block">
                        <span>${gate}</span>
                    </div>
                </div>
                <div class="destination-block status">
                    <div class="primary_status">
                        <span>${status_ru}</span>
                    </div>
                    <div class="sub-text_color sub_status">
                        <span>${status_en}</span>
                    </div>
                </div>
            `
    }

    return {
        renderCurrentDate: function(date) {
            const dateElement = document.querySelector(DOMStrings.currentDateSelector);
            dateElement.innerHTML = date;
        },
        
        renderCurrentTime: function(time) {
            const dateElement = document.querySelector(DOMStrings.currentTimeSelector);
            dateElement.innerHTML = time;
        },

        returnDestinationRecords: function(){
            return destinationRecords;
        },

        createDestination: function(data){
            if(data.length > 0){
                data.map(item => {
                    let dest = destinationRecord(item);

                    if(item.status_en === "Gate Closed"){
                        dest.printNewDestination(DOMStrings.closedFlightsSelector);
                        dest.styleDeparuredFlight();
                    } else if(item.status_en === "Canceled") {
                        dest.printNewDestination(DOMStrings.openFlightsSelector)
                        dest.styleCanceledDeparture() 
                    } 
                    else {
                        dest.printNewDestination(DOMStrings.openFlightsSelector)
                    }
                    
                    destinationRecords.push(dest);

                })
            }

        },

        printListOfDestinations: function(data) {
            if(data.length > 0){
                data.map(item => {
                    let dest = destinationRecord(item);

                    if(item.status_en === "Gate Closed"){
                        dest.printToTheDom(DOMStrings.closedFlightsSelector);
                        dest.styleDeparuredFlight();
                    } else if(item.status_en === "Canceled") {
                        dest.printToTheDom(DOMStrings.openFlightsSelector)
                        dest.styleCanceledDeparture() 
                    } 
                    else {
                        dest.printToTheDom(DOMStrings.openFlightsSelector)
                    }
                    
                    destinationRecords.push(dest);

                })
            }
        },
    }

})();

export default UIController;