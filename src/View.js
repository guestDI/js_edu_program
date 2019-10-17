const UIController = (function(){
    const DOMStrings = {
        destinationRowSelector: '.destination-block-wrapper',
        gateSelector: '.gate-block-wrapper',
        gateImageSelector: '.gate-block > img',
        currentDateSelector: '.current-date-block > div.date > time',
        currentTimeSelector: '.current-date-block > div.time > time',
        closedFlightsSelector: '.schedule-section_closed',
        openFlightsSelector: '.schedule-section_open',
        secondaryLanguageSelector: '.sub-text_color > span',
        subCityLanguageSelector: '.sub-city',
        subCityLanguageSelectorContainer: '.flip',
        statusSelector: '.status'
    };

    
    
    // const firstLine = combineDestinationRecord()

    const printFilghts = flights => {
        let html = [];
    
        flights.map(item => {
            html.push(`<span>${item}</span>`);
        })
    
        return html.join('');
    }

    // const getElementToMove = (id) => {
    //     const flights = document.querySelector(DOMStrings.openFlightsSelector).querySelectorAll(`[data-item-id]`);
    //     let element = null;
    //     flights.forEach(f => {
    //         if(f.getAttribute("data-item-id") == id){
    //             element = f;
    //         }
    //     })

    //     return element;
    // }

    function destinationRecord(destination) {
        const wrapperElement = document.createElement('li');
        const template = getDestinationHtmlTemplate(destination);

        wrapperElement.className = 'destination-block-wrapper';
        wrapperElement.id = destination.id;
        wrapperElement.innerHTML = template;

        const element = wrapperElement;

        return {
            changeFlightStatus: function(status){
                element.querySelector(DOMStrings.secondaryLanguageSelector).innerHTML = status;
            },

            changeDestinationLanguage: function(dest){
                element.querySelector(DOMStrings.secondaryLanguageSelector).innerHTML = dest;
            },

            printToTheDom: function(section){
                document.querySelector(section).appendChild(element);
            },

            styleDeparuredFlight: function(){
                element.querySelector(DOMStrings.gateImageSelector).classList.add("step_closed");
                element.querySelector(DOMStrings.gateSelector).style.color = "#d17d06"
            },

            styleCanceledDeparture: function(){                
                element.querySelector(DOMStrings.statusSelector).classList.add("status_cancelled");
                element.querySelector(DOMStrings.statusSelector).getElementsByTagName("span")[1].style.color = "#ff3333"
                element.getElementsByTagName("time")[0].style.visibility = 'hidden'
            }
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
                    <div>
                        <span>${status_ru}</span>
                    </div>
                    <div class="sub-text_color">
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

        returnDestinationRecord: function(destination){
            const f1 = destinationRecord(destination);

            return f1;
        },

        // destroy: function(id){
        //     let elementToRemove = getElementToMove(id);
            
        //     if(elementToRemove){
        //         elementToRemove.classList.add('hide');
        //     }
        // },

        // createNew: function(newFlights){
        //     const html = [];
        //     let elementToAdd = null;
            
        //     if(newFlights.length > 0){
        //         newFlights.forEach((f, i) => {
        //             elementToAdd = this.renderItem(f);
        //             document.querySelector(DOMStrings.openFlightsSelector).insertAdjacentHTML('beforeend', elementToAdd);
        //             if(elementToAdd){
        //                 new DOMParser().parseFromString(elementToAdd , 'text/html').classList.add('show')
        //             }
        //         })
        //     }
        // },

        // renderClosedItem: function(item){
        //     const el = this.renderItem(item);
        //     document.querySelector(DOMStrings.closedFlightsSelector).insertAdjacentHTML('afterbegin', el);

        //     el.classList.add('show')           

        // },

        printInitialListOfDestinations: function(data) {
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
                    
                })
            }
        },

        // renderStatusOnSecondaryLanguage: function(data, lng){
        //     let flightsHtml = document.querySelectorAll(DOMStrings.secondaryLanguageSelector);    
        //     data.forEach((f, i) => {
        //         flightsHtml[i].innerHTML = f[lng]; 
                   
        //     });
        // },

        // renderCityOnSecondaryLanguage: function(data, lng){
        //     let flightsHtml = document.querySelectorAll(DOMStrings.subCityLanguageSelector);
        //     // const destinationRows = document.querySelectorAll(DOMStrings.destinationRowSelector);
        //     // const statusBlocks = document.querySelectorAll('.flip');

        //     if(data && data.length > 0){
        //         data.forEach((f, i) => {
        //             // statusBlocks[i].classList.add('type')
        //             flightsHtml[i].innerHTML = f[lng];                  
        //         });
        //     }
            
        // },

    }

})();

export default UIController;