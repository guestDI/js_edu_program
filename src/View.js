import {
	statuses
} from './constants';

const UIController = (function () {
	const DOMStrings = {
		mainSelector: 'main',
		destinationRowSelector: '.destination-block-wrapper',
		gateSelector: '.gate-block-wrapper',
		gateImageSelector: '.gate-block > img',
		currentDateSelector: '.current-date-block > div.date > time',
		currentTimeSelector: '.current-date-block > div.time > time',
		closedDestinationsSelector: '.schedule-section_closed',
		openDestinationsSelector: '.schedule-section_open',
		flightsSelector: '.flights',
		subCityLanguageSelector: '.sub-city',
		statusSelector: '.status',
		primaryStatusSelector: '.primary_status',
		secondaryStatusSelector: '.status > .sub-text_color > span',
		noDataText: '<div class="no-data"><h3>No Data</h3></div>'
	};

	const destinationRecords = [];

	const displayFilghts = flights => {
		let flightsList = [];

		if (flights) {
			flightsList = flights.map(item => {
				return `<span>${item}</span>`;
			});
		}

		return flightsList.join('');
	};

	function destinationRecord(destination) {
		const wrapperElement = document.createElement('li');
		const template = getHtmlTemplate(destination);

		wrapperElement.classList.add('destination-block-wrapper', 'active');
		wrapperElement.id = destination.id;
		wrapperElement.innerHTML = template;

		const element = wrapperElement;

		const openSection = document.querySelector(DOMStrings.openDestinationsSelector);
		const closedSection = document.querySelector(DOMStrings.closedDestinationsSelector);
		const secondaryStatusField = element.querySelector(DOMStrings.secondaryStatusSelector);
		const subCity = element.querySelector(DOMStrings.subCityLanguageSelector);
		const primaryStatus = element.querySelector(DOMStrings.primaryStatusSelector);

		return {
			getElementId: function () {
				return destination.id;
			},

			getElementStatus: function () {
				return primaryStatus.innerHTML;
			},

			getElementTime: function () {
				return destination.dateTime;
			},

			displayDestination: function (status) {
				let section = status == statuses.EN.CLOSED ? closedSection : openSection;
				section.appendChild(element);
			},

			printClosedToTheDom: function () {
				closedSection.insertBefore(
					element,
					closedSection.childNodes[0]
				);
				element.classList.add('active');

			},

			displayNewDestination: function () {
				openSection.appendChild(element);
			},

			styleDeparuredFlight: function () {
				element.classList.add('closed');
			},

			styleCanceledDeparture: function () {
				element.classList.add('canceled');
			},

			styleScheduledDestination: function () {
				element.classList.remove('canceled');
			},

			changeDestinationLanguage: function (destination) {
				subCity.setAttribute('data-content', destination);
			},

			changeStatusLanguage: function (status) {
				secondaryStatusField.setAttribute('data-content', status);
			},

			changeStatus: function (status_ru, secondaryStatus) {
				primaryStatus.innerHTML = status_ru;
				secondaryStatusField.setAttribute('data-content', secondaryStatus);
			},

			collapseDestination: function () {
				element.classList.toggle('active');
			},

			expandDestination: function () {
				closedSection.insertBefore(
					element,
					closedSection.childNodes[0]
				);

				element.classList.add('active');
			}
		};
	}

	function getHtmlTemplate({
		dateTime,
		destination_ru,
		destination_en,
		flights,
		gate_time,
		gate,
		status
	}) {
		return `<div class="destination-block time sub-text_color">
                    <time>${dateTime}</time>
                </div>
                <div class="destination-block flights-destination">
                    <div>
                        <span class="city">${destination_ru}</span>
                        <span class="sub-text_color sub-city sub-text_size" data-content="${destination_en}"></span>
                    </div>
                    <div class="flights">
                        ${displayFilghts(flights)}
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
                        <span data-content="${status.status_en}"></span>
                    </div>
                </div>`;
	}

	return {
		displayCurrentDate: function (date) {
			const dateElement = document.querySelector(
				DOMStrings.currentDateSelector
			);
			dateElement.innerHTML = date;
		},

		displayCurrentTime: function (time) {
			const dateElement = document.querySelector(
				DOMStrings.currentTimeSelector
			);
			dateElement.innerHTML = time;
		},

		returnDestinations: function () {
			return destinationRecords;
		},

		returnClosedDestinations: function () {
			return destinationRecords.filter(
				d => d.getElementStatus() == statuses.EN.CLOSED
			);
		},

		createDestination: function (destination) {
			let newDestination = destinationRecord(destination);
			destinationRecords.push(newDestination);
			return newDestination;
		},

		renderNoDataMessage: function () {
			const mainBlock = document.querySelector(DOMStrings.mainSelector);
			mainBlock.innerHTML = DOMStrings.noDataText;
		}
	};
})();

export default UIController;