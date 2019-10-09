const UIController = (function(){
    const DOMStrings = {
        destinationRowSelector: '.destination-block-wrapper',
        gateSelector: '.gate-block-wrapper',
        currentDateSelector: '.current-date-block > div.date > time',
        currentTimeSelector: '.current-date-block > div.time > time',
        closedFlightsSelector: '.schedule-section_closed',
        openFlightsSelector: '.schedule-section_open',
        secondaryLanguageSelector: '.sub-text_color > span',
        subCityLanguageSelector: '.sub-city',
        subCityLanguageSelectorContainer: '.flip'
    };

    const renderFilghts = flights => {
        let html = [];
    
        flights.map(item => {
            html.push(`<span>${item}</span>`);
        })
    
        return html.join('');
    }

    const getElementToMove = (id) => {
        const flights = document.querySelector(DOMStrings.openFlightsSelector).querySelectorAll(`[data-item-id]`);
        let element = null;
        flights.forEach(f => {
            if(f.getAttribute("data-item-id") == id){
                element = f;
            }
        })

        return element;
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

        renderItem: function(item) {
            return `
                <li class="destination-block-wrapper" data-item-id=${item.id}>
                    <div class="destination-block time sub-text_color">
                        <time>${item.dateTime}</time>
                    </div>
                    <div class="destination-block flights-destination">
                        <div class="left city">
                        <span>${item.destination_ru}</span>
                        </div>
                        <div class="flip">
                            <span class="sub-text_color sub-city sub-text_size" ></span>
                        </div>
                        <div class="flights">
                            ${renderFilghts(item.flights)}
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
                        <div class="sub-text_color">
                            <span></span>
                        </div>
                    </div>
                </li>
            `
        },

        destroy: function(id){
            let elementToRemove = getElementToMove(id);
            
            if(elementToRemove){
                elementToRemove.classList.add('hide');
            }
        },

        // createNew: function(item){
        //     renderItem(item);
            
        //     if(elementToRemove){
        //         elementToRemove.classList.add('hide');
        //     }
        // },

        renderItems: function(data) {
            let closedFlightsHtml = [];
            let openFlightsHtml = [];
        
            data.map(item => {
                if(item.status_en === "Gate Closed"){
                    closedFlightsHtml.push(this.renderItem(item));
                } else {
                    openFlightsHtml.push(this.renderItem(item));
                }
                
            })
        
            if(closedFlightsHtml.length !== 0){
                document.querySelector(DOMStrings.closedFlightsSelector).insertAdjacentHTML('afterbegin', closedFlightsHtml.join(''));
            } 
            
            if(openFlightsHtml.length !== 0){
                document.querySelector(DOMStrings.openFlightsSelector).insertAdjacentHTML('beforeend', openFlightsHtml.join(''));
            }
        },

        renderStatusOnSecondaryLanguage: function(data, lng){
            let flightsHtml = document.querySelectorAll(DOMStrings.secondaryLanguageSelector);    
            data.forEach((f, i) => {
                flightsHtml[i].innerHTML = f[lng]; 
                   
            });
        },

        renderCityOnSecondaryLanguage: function(data, lng){
            let flightsHtml = document.querySelectorAll(DOMStrings.subCityLanguageSelector);    

            data.forEach((f, i) => {
                // flightsHtml[i].classList.add('pre-animation')
                flightsHtml[i].innerHTML = f[lng];  
                // flightsHtml[i].classList.remove('pre-animation')            
                
            });
            
        },

        setGateStyle: function(data){
            const gate = document.querySelectorAll(DOMStrings.gateSelector);
            
            data.forEach((item, i) => {
                if(item.status_en == "Gate Closed"){
                    gate[i].querySelector("img").classList.add("step_closed");
                    gate[i].style.color = "#d17d06"
                }
            })   
        }
    }

})();

export default UIController;