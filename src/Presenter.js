import View from './View';
import Controller from './Controller';
import {
    displayEnvironmentMessage,
    formatDateTime
} from './helper';
import {
    statuses
} from './constants';

const languages = ['en', 'ch', 'de'];
const defaultLng = 'en';

const presenter = (function (flightModel, flightView) {
    const state = {
        currentDate: Date.getDate,
        destinations: [],
        changedFlights: [],
        current_secondary_lng: 'en',
        timeOut: null,
        currentLngIndex: 0,
    };

    const formatDepartureTime = destinations => {
        let updated = destinations.map(destination => {
            const oldTime = destination.dateTime;
            destination.dateTime = formatDateTime(oldTime, 'HH:mm');

            return destination;
        });

        return updated;
    };

    const isNewDestinationExists = (newState, prevState) => {
        let newDestinations = [];

        if (newState.length != prevState.length) {
            newDestinations = newState.filter(({
                id
            }) => {
                return !prevState.find(o => o.id == id);
            });
        }
        return newDestinations;
    };

    const isStatusChanged = (newState, prevState) => {
        let changedDestinations = [];
        changedDestinations = newState.filter(({
            id,
            status
        }) => prevState.find(
            o => o.id == id && o.status[`status_${defaultLng}`] != status[`status_${defaultLng}`]
        ));

        return changedDestinations;
    };

    const changeStatus = changedDestinations => {
        let destinations = flightView.returnDestinations();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = changedDestinations.find(obj => obj.id == id);
            if (obj) {
                let lng = languages[state.currentLngIndex - 1];
                let secondaryLng = obj.status[`status_${lng}`];
                d.changeStatus(obj.status['status_ru'], secondaryLng);

                if (obj.status[`status_${defaultLng}`] == statuses.EN.CANCELED) {
                    d.styleCanceledDeparture();
                }
            }
        });
    };

    const closeDestination = changedDestinations => {
        let destinations = flightView.returnDestinations();
        let el = null;

        changedDestinations.forEach(d => {
            if (d.status[`status_${defaultLng}`] == statuses.EN.CLOSED) {
                el = destinations.find(
                    destination => destination.getElementId() == d.id
                );
                if (el) {
                    el.collapseDestination();
                    setTimeout(() => el.expandDestination(), 1000);
                    setTimeout(() => el.styleDeparuredFlight(), 2000);
                }
            }
        });
    };

    const displayInitialDestinations = data => {
        if (data.length) {
            data.forEach(d => {
                let destination = flightView.createDestination(d);

                destination.displayDestination(d.status[`status_${defaultLng}`]);
                if (d.status[`status_${defaultLng}`] == statuses.EN.CANCELED) {
                    destination.styleCanceledDeparture();
                }
            });
        } else {
            flightView.renderNoDataMessage();
        }
    };

    const addNewDestination = data => {
        if (data.length) {
            data.forEach(d => {
                let destination = flightView.createDestination(d);
                destination.displayNewDestination();
            });
        }
    };
    //TODO: change sort to asc
    const sortClosedDestinations = data => {
        data.sort((a, b) => (
            new Date('1970/01/01 ' + a.getElementTime()) - new Date('1970/01/01 ' + b.getElementTime())
        ));

        return data;
    };

    const setGlobalTimer = () => {
        flightModel.getDestinations().then(r => {
            let newDestinations = isNewDestinationExists(r, state.destinations);
            let changedDestinations = isStatusChanged(r, state.destinations);

            if (newDestinations.length > 0) {
                addNewDestination(formatDepartureTime(newDestinations));

                state.destinations = r.slice();
            }

            if (changedDestinations.length > 0) {
                let closed = [...flightView.returnClosedDestinations()];
                changeStatus(changedDestinations);
                closeDestination(changedDestinations);

                if (sortClosedDestinations(closed).length >= 5) {
                    sortClosedDestinations(closed).length = 5;

                    let el = sortClosedDestinations(closed)[4];
                    el.collapseDestination();
                }

                state.destinations = r.slice();
            }
        });

        setTimeout(setGlobalTimer, 2000);
    };

    const changeLanguage = () => {
        let newIndex = ++state.currentLngIndex;

        if (newIndex >= languages.length) {
            newIndex = 0;
        }

        state.currentLngIndex = newIndex;
    }

    const setLangTimeout = () => {
        setInterval(() => {
            let lng = languages[state.currentLngIndex];
            let destinations = flightView.returnDestinations();

            destinations.forEach(d => {
                let id = d.getElementId();
                let obj = state.destinations.find(obj => obj.id == id);
                if (obj[`destination_${lng}`]) {
                    d.changeDestinationLanguage(obj[`destination_${lng}`]);
                }
                d.changeStatusLanguage(obj.status[`status_${lng}`]);
            });

            changeLanguage();
        }, 2000)
    };

    return {
        init: function () {
            displayEnvironmentMessage();
            flightModel.getDestinations()
                .then(r => {
                    let resultState = [...r];
                    flightView.displayCurrentDate(
                        formatDateTime(state.displayCurrentDate, 'DD.MM.YYYY')
                    );
                    flightView.displayCurrentTime(
                        formatDateTime(state.displayCurrentDate, 'HH:mm')
                    );
                    displayInitialDestinations(
                        formatDepartureTime(resultState)
                    );

                    state.destinations = resultState;
                })
                .catch(error => {
                    flightView.renderNoDataMessage();
                    console.error(error);
                });

            setLangTimeout();
            setGlobalTimer();
        },
    };
})(Controller, View);

window.onload = function () {
    presenter.init();
};