const DOMStrings = {
    date: '.current-date-block > div.date > time',
    time: '.current-date-block > div.time > time'
};

export const renderCurrentDate = date => {
    const dateElement = document.querySelector(DOMStrings.date);
    dateElement.innerHTML = date;
};

export const renderCurrentTime = time => {
    const dateElement = document.querySelector(DOMStrings.time);
    dateElement.innerHTML = time;
};