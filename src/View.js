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
		subCityLanguageSelectorContainer: '.flip',
		statusSelector: '.status',
		primaryStatusSelector: '.primary_status',
		secondaryStatusSelector: '.status > .sub-text_color > span'
	};

	const destinationRecords = [];

	const displayFilghts = flights => {
		const flightsList = [];

		if (flights) {
			flights.map(item => {
				flightsList.push(`<span>${item}</span>`);
			});
		}

		return flightsList.join('');
	};

	function destinationRecord(destination) {
		const wrapperElement = document.createElement('li');
		const template = getHtmlTemplate(destination);

		wrapperElement.className = 'destination-block-wrapper';
		wrapperElement.id = destination.id;
		wrapperElement.innerHTML = template;

		const element = wrapperElement;

		return {
			getElementId: function () {
				return element.getAttribute('id');
			},

			getElementStatus: function () {
				return element.querySelector(DOMStrings.primaryStatusSelector)
					.innerHTML;
			},

			getElementTime: function () {
				return destination.dateTime;
			},

			changeStatus: function (status) {
				element.querySelector(DOMStrings.secondaryLanguageSelector).innerHTML = status;
			},

			displayDestination: function (status) {
				let section = status == 'Gate Closed' ? DOMStrings.closedDestinationsSelector : DOMStrings.openDestinationsSelector;
				document.querySelector(section).appendChild(element);
			},

			printClosedToTheDom: function () {
				let closedSection = document.querySelector(
					DOMStrings.closedDestinationsSelector
				);
				closedSection.insertBefore(
					element,
					closedSection.childNodes[0]
				);
				setTimeout(() => element.classList.add('show'), 500);
			},

			displayNewDestination: function (status) {
				let section =
					status == 'Gate Closed' ?
					DOMStrings.closedDestinationsSelector :
					DOMStrings.openDestinationsSelector;
				element.classList.add('hide');
				document.querySelector(section).appendChild(element);
				setTimeout(() => element.classList.add('show'), 0);
			},

			styleDeparuredFlight: function () {
				element
					.querySelector(DOMStrings.gateImageSelector)
					.classList.add('step_closed');
				element.querySelector(DOMStrings.gateSelector).style.color =
					'#d17d06';
			},

			styleCanceledDeparture: function () {
				element
					.querySelector(DOMStrings.statusSelector)
					.classList.add('status_cancelled');
				element
					.querySelector(DOMStrings.statusSelector)
					.getElementsByTagName('span')[1].style.color = '#ff3333';
				element.getElementsByTagName('time')[0].style.visibility =
					'hidden';
			},

			styleScheduledDestination: function () {
				element
					.querySelector(DOMStrings.statusSelector)
					.classList.remove('status_cancelled');
				element
					.querySelector(DOMStrings.statusSelector)
					.getElementsByTagName('span')[1].style.color = '#b8b8b8';
				element.getElementsByTagName('time')[0].style.visibility =
					'visible';
			},

			//TODO: remove innerHTML and use css classes
			changeDestinationLanguage: function (destination) {
				element.querySelector(
					DOMStrings.subCityLanguageSelector
				).innerHTML = destination;
			},

			//TODO: remove innerHTML and use css classes
			changeStatusLanguage: function (status) {
				element.querySelector(
					DOMStrings.secondaryStatusSelector
				).innerHTML = status;
			},

			changeStatus: function (status_ru, secondaryStatus) {
				element.querySelector(
					DOMStrings.primaryStatusSelector
				).innerHTML = status_ru;
				element.querySelector(
					DOMStrings.secondaryStatusSelector
				).innerHTML = secondaryStatus;
			},

			collapseDestinationRecord: function () {
				setTimeout(() => element.classList.remove('show'), 0);
				setTimeout(() => element.classList.add('hide'), 0);
				// element.remove();
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
                        <span class="sub-text_color sub-city sub-text_size flip" >${destination_en}</span>
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
                        <span>${status.status_en}</span>
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
				d => d.getElementStatus() == 'Посадка завершена'
			);
		},

		createDestination: function (destination) {
			let newDestination = destinationRecord(destination);
			destinationRecords.push(newDestination);
			return newDestination;
		},

		renderNoDataMessage: function () {
			const mainBlock = document.querySelector(DOMStrings.mainSelector);
			mainBlock.innerHTML = '<div class="no-data"><h3>No Data</h3></div>'
		}
	};
})();

export default UIController;