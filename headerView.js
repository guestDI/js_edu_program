export const renderCurrentDate = date => {
    const dateElement = document.querySelector('.current-date-block > div.date > time');
    dateElement.innerHTML = date;
}

export const renderCurrentTime = time => {
    const dateElement = document.querySelector('.current-date-block > div.time > time');
    dateElement.innerHTML = time;
}