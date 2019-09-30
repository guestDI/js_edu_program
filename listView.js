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
                <time>${item.time}</time>
            </div>
            <div class="destination-block flights-destination">
                <div class="left city">
                <span>${item.destination_ru}</span>
                </div>
                <div>
                <span class="sub-text_color city">${item.destination_en}</span>
                </div>
                <div class="flights">
                    ${renderFilghts(item.flights).join('')}
                </div>
            </div>
            <div class="destination-block gate-block-wrapper">
                <div class="gate-block">
                <img class="step" src="images/steps.png"/>
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
                    <span>${item.status_en}</span>
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

    return html;
}