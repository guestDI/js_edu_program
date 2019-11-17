import moment from 'moment';
import View from './View';
import Model from './Model';

const presenter = (function (flightModel, flightView) {
    const state = {
        currentDate: Date.getDate,
        destinations: [],
        changedFlights: [],
        current_secondary_lng: 'en',
        timeOut: null,
    };

    const formattedDateTime = function (format) {
        return moment(state.currentDate).format(format);
    };

    const formatDepartureTime = destinations => {
        let updated = destinations.map(destination => {
            const oldTime = destination.dateTime;
            destination.dateTime = moment(oldTime).format('HH:mm');

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
            o =>
            o.id == id && o.status['status_ru'] != status['status_ru']
        ));

        return changedDestinations;
    };

    const changeStatus = changedDestinations => {
        let destinations = flightView.returnDestinationRecords();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = changedDestinations.find(obj => obj.id == id);
            if (obj) {
                let secondaryLng =
                    state.current_secondary_lng === 'en' ?
                    obj.status['status_en'] :
                    obj.status['status_ch'];
                d.changeStatus(obj.status['status_ru'], secondaryLng);

                if (obj.status['status_en'] == 'Canceled') {
                    d.styleCanceledDeparture();
                }
            }
        });
    };

    const closeDestination = changedDestinations => {
        let destinations = flightView.returnDestinationRecords();
        let el = null;

        changedDestinations.forEach(d => {
            if (d.status['status_ru'] == 'Посадка завершена') {
                el = destinations.find(
                    destination => destination.getElementId() == d.id
                );
                if (el) {
                    el.collapseDestinationRecord();
                    setTimeout(() => el.printClosedToTheDom(), 700);
                    setTimeout(() => el.styleDeparuredFlight(), 800);
                }
            }
        });
    };

    const displayInitialDestinations = data => {
        if (data.length) {
            data.forEach(d => {
                let destination = flightView.createDestination(d);

                destination.displayDestination(d.status['status_en']);
                if (d.status['status_en'] == 'Canceled') {
                    destination.styleCanceledDeparture();
                }
            });
        } else {
            flightView.renderNoDataMessage();
        }
    };

    const displayNewDestination = data => {
        if (data.length) {
            data.forEach(d => {
                let destination = flightView.createDestination(d);

                let secondaryLng =
                    state.current_secondary_lng === 'en' ?
                    'status_en' :
                    'status_ch';
                destination.printNewDestination(d.status[secondaryLng]);
                if (d.status['status_en'] == 'Canceled') {
                    destination.styleCanceledDeparture();
                }
            });
        }
    };

    const sortClosedDestinations = data => {
        data.sort((a, b) => (
            new Date('1970/01/01 ' + b.getElementTime()) - new Date('1970/01/01 ' + a.getElementTime())
        ));

        return data;
    };

    const setGlobalTimer = () => {
        flightModel.getDestinations().then(r => {
            let newDestinations = isNewDestinationExists(r, state.destinations);
            let changedDestinations = isStatusChanged(r, state.destinations);

            if (newDestinations.length > 0) {
                displayNewDestination(formatDepartureTime(newDestinations));

                state.destinations = r.slice();
            }

            if (changedDestinations.length > 0) {
                let closed = flightView.returnClosedDestinationRecords();
                changeStatus(changedDestinations);
                closeDestination(changedDestinations);

                if (sortClosedDestinations(closed).length >= 5) {
                    sortClosedDestinations(closed).length = 5;

                    let el = sortClosedDestinations(closed)[4];
                    el.collapseDestinationRecord();
                }

                state.destinations = r.slice();
            }
        });

        setTimeout(setGlobalTimer, 3000);
    };
    //TODO: create array of languages and
    const changeSecondaryLanguage = () => {
        let updated = '';
        let newLanguage = {};

        if (state.current_secondary_lng == 'en') {
            updated = 'ch';
            newLanguage = {
                destination_lng: 'destination_ch',
                status_lng: 'status_ch',
            };
        } else {
            updated = 'en';
            newLanguage = {
                destination_lng: 'destination_en',
                status_lng: 'status_en',
            };
        }

        state.current_secondary_lng = updated;

        return newLanguage;
    };

    const setLangTimeout = () => {
        let lng = changeSecondaryLanguage();
        let destinations = flightView.returnDestinationRecords();

        destinations.forEach(d => {
            let id = d.getElementId();
            let obj = state.destinations.find(obj => obj.id == id);
            if (obj[lng.destination_lng]) {
                d.changeDestinationLanguage(obj[lng.destination_lng]);
            }
            d.changeStatusLanguage(obj.status[lng.status_lng]);
        });

        setTimeout(setLangTimeout, 5000);
    };

    return {
        init: function () {
            console.log('Application has started'); //TODO: dev and prod mode to display this only on dev
            flightModel.getDestinations()
                .then(r => {
                    let resultState = r.slice();
                    flightView.displayCurrentDate(
                        formattedDateTime('DD.MM.YYYY')
                    );
                    flightView.displayCurrentTime(
                        formattedDateTime('HH:mm')
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
})(Model, View);

window.onload = function () {
    presenter.init();
};