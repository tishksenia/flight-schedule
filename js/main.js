let model = {
	data: undefined,
	delayed_flights: undefined,

	loadFlightsData: function() {
		let xhr = new XMLHttpRequest();

		xhr.open('GET', 'https://raw.githubusercontent.com/tishksenia/flight-schedule/master/data.json');

		xhr.send();
		xhr.addEventListener('load', function() {
			model.data = JSON.parse(xhr.responseText);
			controller.outputFlightsTable();
		});
	},
	getDelayedFlightsData: function() {
		if(this.delayed_flights === undefined) {
			this.delayed_flights = [];
			let data = this.data;
			for(let i in data) {
				for(let j = 0; j < data[i].length; j++) {
					if(data[i][j].flight_status === "delayed") {
						this.delayed_flights.push(data[i][j]);
					}
				}
			}
		}
		return this.delayed_flights;
	},
	//вернет массив объектов, имя которых содержит в себе value
	findFlightByName: function(value) {
		let matches = [];
		let data = this.data;
		
		for(let i in data) {
			for(let j = 0; j < data[i].length; j++) {
				if(data[i][j].hasOwnProperty("name")) 
					if(data[i][j].name.includes(value)) 
						matches.push(data[i][j]);
			}
		}
		return matches;
	}
};

let controller = {
	init: function() {
		model.loadFlightsData();
		view.initializeButtons();
		view.initializeTextField();
	},

	outputFlightsTable: function(flightsData) {
		view.outputFlightsTable();
	},

	getData: function() {
		return model.data;
	},

	getDelayedFlightsData: function() {
		return model.getDelayedFlightsData();
	},

	getSearchResults: function(value) {
		return model.findFlightByName(value);
	}
};

let view = {
	initializeTextField: function() {
		let search_input_field = document.querySelector('.search-input-field');
		search_input_field.addEventListener('input', function() {
			let results = controller.getSearchResults(search_input_field.value);
			view.clearFlightsTable();
			view.outputFlightsTable(undefined, results);
		});
	},

	initializeButtons: function() {
		let arrive_btn = document.querySelector('.arrive-btn');
		let departure_btn = document.querySelector('.departure-btn');
		let delayed_btn = document.querySelector('.delayed-btn');

		arrive_btn.addEventListener('click', function() {
			view.clearFlightsTable();
			view.outputFlightsTable('arrival');
		});
		departure_btn.addEventListener('click', function() {
			view.clearFlightsTable();
			view.outputFlightsTable('departure');
		});
		delayed_btn.addEventListener('click', function() {
			view.clearFlightsTable();
			view.outputFlightsTable('delayed');
		});
	},

	//вывод содержимого таблицы в зависимости от переданных параметров
	outputFlightsTable: function(filter_parameter, results_array) {
		if(results_array != undefined) {
			this.buildTablePartFromArray(results_array);
		}
		else if(filter_parameter === "arrival") {
			this.buildTablePart("arrival_flights");
		}
		else if(filter_parameter === "departure") {
			this.buildTablePart("departure_flights");
		}
		else if(filter_parameter === "delayed") {
			this.buildTablePart("delayed");
		}
		else {
			this.buildTablePart("arrival_flights");
			this.buildTablePart("departure_flights");
		}
	},

	clearFlightsTable: function() {
		let table_body = document.getElementsByClassName('time-table_content')[0];
		table_body.innerHTML = "";
	},

	//создает структуру строк, заполняет ее данными и присоединяет к таблице
	buildTablePart: function(filter_parameter) {
		let table_body = document.getElementsByClassName('time-table_content')[0];

		if(filter_parameter === "delayed") {
			let delayed_flights = controller.getDelayedFlightsData();
			for(let i = 0; i < delayed_flights.length; i++) {
				let row = this.makeRow(delayed_flights[i]);
				table_body.appendChild(row);
			}
		}
		else {
			let data = controller.getData();
			for(let i = 0; i < data[filter_parameter].length; i++) {
				let row = this.makeRow(data[filter_parameter][i]);
				table_body.appendChild(row);
			}
		}
	},

	buildTablePartFromArray: function(array) {
		let table_body = document.getElementsByClassName('time-table_content')[0];
		for(let i = 0; i < array.length; i++) {
			let row = this.makeRow(array[i]);
			table_body.appendChild(row);
		}
	},
	//создает 1 строку таблицы, соответствующую 1 записи о рейсе, и возвращает ее
	makeRow: function(flight_object) {
		let tr = document.createElement('tr');
		for(let i in flight_object) {
			let td = this.makeTd();
			td.innerHTML = flight_object[i];
			tr.appendChild(td);
		}
		return tr;
	},

	//возвращает td.content_item
	makeTd: function() {
		let td = document.createElement('td');
		td.classList.add('content_item');
		return td;
	}
};

controller.init();
