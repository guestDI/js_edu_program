const UIController = (function(){
    const DOMStrings = {
        destinationRowSelector: '.destination-block-wrapper',
        gateSelector: '.gate-block-wrapper',
        gateImageSelector: '.gate-block > img',
        currentDateSelector: '.current-date-block > div.date > time',
        currentTimeSelector: '.current-date-block > div.time > time',
        closedFlightsSelector: '.schedule-section_closed',
        openFlightsSelector: '.schedule-section_open',
        flightsSelector: '.flights',
        subCityLanguageSelector: '.sub-city',
        subCityLanguageSelectorContainer: '.flip',
        statusSelector: '.status',
        primaryStatusSelector: '.status > .primary_status > span',
        secondaryStatusSelector: '.status > .sub-text_color > span'
    };

    const destinationRecords = [];     

    const printFilghts = flights => {
        let html = [];
    
        if(flights){
            flights.map(item => {
                html.push(`<span>${item}</span>`);
            })
        } 
    
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

            printToTheDom: function(status){
                let section = status == "Gate Closed" ? DOMStrings.closedFlightsSelector : DOMStrings.openFlightsSelector
                document.querySelector(section).appendChild(element);                
            },

            printClosedToTheDom: function(){
                document.querySelector(DOMStrings.closedFlightsSelector).appendChild(element);
                setTimeout(() => element.classList.add('show'), 500)
            },

            printNewDestination: function(status){
                let section = status == "Gate Closed" ? DOMStrings.closedFlightsSelector : DOMStrings.openFlightsSelector
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

            styleScheduledDestination: function(){                
                element.querySelector(DOMStrings.statusSelector).classList.remove("status_cancelled");
                element.querySelector(DOMStrings.statusSelector).getElementsByTagName("span")[1].style.color = "#b8b8b8"
                element.getElementsByTagName("time")[0].style.visibility = 'visible'
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

            collapseDestinationRecord: function(){
                setTimeout(() => element.classList.toggle('hide'), 0);
                // element.remove();
            },
        };
    }

    function getDestinationHtmlTemplate({dateTime, destination_ru, destination_en, flights, gate_time, gate, status}){
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
                        <span>${status.status_ru}</span>
                    </div>
                    <div class="sub-text_color sub_status">
                        <span>${status.status_en}</span>
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

        createDestination: function(destination){
            let newDestination = destinationRecord(destination);
            destinationRecords.push(newDestination);
            return newDestination;
        },
    }

})();

export default UIController;