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
        currentLngIndex: 0,
        closedDestinations: [],
    };

    const formatDepartureTime = (destinations) => {
        const updated = destinations.map((destination) => {
            const oldTime = destination.dateTime;
            destination.dateTime = formatDateTime(oldTime, 'HH:mm');

            return destination;
        });

        return updated;
    };

    const isNewDestinationExists = (newState, prevState) => {
        let newDestinations = [];

        if (newState.length !== prevState.length) {
            newDestinations = newState.filter(({
                id
            }) => {
                return !prevState.find((o) => o.id === id);
            });
        }
        return newDestinations;
    };

    const isStatusChanged = (newState, prevState) => {
        let changedDestinations = [];
        changedDestinations = newState.filter(({
                id,
                status
            }) =>
            prevState.find(
                (o) => o.id === id && o.status[`status_${defaultLng}`] !== status[`status_${defaultLng}`]
            )
        );

        return changedDestinations;
    };

    const changeStatus = (changedDestinations) => {
        const destinations = flightView.returnDestinations();

        destinations.forEach((d) => {
            const id = d.getElementId();
            const obj = changedDestinations.find((obj) => obj.id == id);
            if (obj) {
                const lng = languages[state.currentLngIndex];
                const secondaryLng = obj.status[`status_${lng}`];

                d.changeStatus(obj.status.status_ru, secondaryLng);

                if (obj.status[`status_${defaultLng}`] == statuses['en-EN'].CANCELED) {
                    d.styleCanceledDeparture();
                }
            }
        });
    };

    const closeDestination = (changedDestinations) => {
        const destinations = flightView.returnDestinations();
        let el = null;

        changedDestinations.forEach((d) => {
            if (d.status[`status_${defaultLng}`] === statuses['en-EN'].CLOSED) {
                el = destinations.find((destination) => destination.getElementId() === d.id);
                if (el) {
                    el.collapseDestination();
                    setTimeout(() => {
                        el.expandDestination();
                        el.styleDeparuredFlight();
                    }, 900);
                    state.closedDestinations.push(el);
                }
            }
        });
    };

    const displayInitialDestinations = (data) => {
        if (data.length) {
            const lng = languages[state.currentLngIndex];
            data.forEach((d) => {
                const destination = flightView.createDestination({
                    ...d,
                    lng,
                });

                destination.displayDestination(d.status[`status_${defaultLng}`]);
                if (d.status[`status_${defaultLng}`] == statuses['en-EN'].CANCELED) {
                    destination.styleCanceledDeparture();
                }
            });
        } else {
            flightView.renderNoDataMessage();
        }
    };

    const addNewDestination = (data) => {
        if (data.length) {
            const lng = languages[state.currentLngIndex];
            data.forEach((d) => {
                const destination = flightView.createDestination({
                    ...d,
                    lng,
                });
                destination.displayNewDestination();
            });
        }
    };

    const sortClosedDestinations = (data) => {
        data.sort(
            (a, b) =>
            new Date(`1970/01/01 ${a.getElementTime()}`) - new Date(`1970/01/01 ${b.getElementTime()}`)
        );

        return data;
    };

    const setGlobalTimer = () => {
        flightModel.getDestinations().then((r) => {
            const newDestinations = isNewDestinationExists(r, state.destinations);
            const changedDestinations = isStatusChanged(r, state.destinations);

            if (newDestinations.length > 0) {
                addNewDestination(formatDepartureTime(newDestinations));

                state.destinations = r.slice();
            }

            if (changedDestinations.length > 0) {
                changeStatus(changedDestinations);
                closeDestination(changedDestinations);

                state.destinations = r.slice();
            }

            const closed = [...sortClosedDestinations(state.closedDestinations)];

            if (closed.length > 5) {
                closed.length = 5;

                closed[0].collapseDestination();
                state.closedDestinations.splice(0, 1);
            }
        });

        changeLanguage();
        changeSecondaryLanguage();

        setTimeout(setGlobalTimer, 3000);
    };

    const changeLanguage = () => {
        let newIndex = ++state.currentLngIndex;

        if (newIndex >= languages.length) {
            newIndex = 0;
        }

        state.currentLngIndex = newIndex;
    };

    const changeSecondaryLanguage = () => {
        const lng = languages[state.currentLngIndex];
        const destinations = flightView.returnDestinations();

        destinations.forEach((d) => {
            const id = d.getElementId();
            const obj = state.destinations.find((obj) => obj.id == id);
            if (obj[`destination_${lng}`]) {
                d.changeDestinationLanguage(obj[`destination_${lng}`]);
            }
            d.changeStatusLanguage(obj.status[`status_${lng}`]);
        });
    };

    return {
        init() {
            displayEnvironmentMessage();
            flightModel
                .getDestinations()
                .then((r) => {
                    const resultState = [...r];
                    flightView.displayCurrentDate(formatDateTime(state.displayCurrentDate, 'DD.MM.YYYY'));
                    flightView.displayCurrentTime(formatDateTime(state.displayCurrentDate, 'HH:mm'));
                    displayInitialDestinations(formatDepartureTime(resultState));

                    state.destinations = resultState;
                })
                .catch((error) => {
                    flightView.renderNoDataMessage();
                    console.error(error);
                });

            setGlobalTimer();
        },
    };
})(Controller, View);

window.onload = function () {
    presenter.init();
};