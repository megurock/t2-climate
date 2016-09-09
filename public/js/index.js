(function() {

	var connection, temperature = 0, humidity;



	/* Create web-socket connection */
	function createConnection(config) {
			var conn = new WebSocket(config.url);
			console.log("new connection:", conn);

			conn.onopen = function() {
				console.log("Connection opened");
			};

			conn.onclose = function() {
				console.log("Connection closed");
			};

			conn.onerror = function() {
				console.error("Connection error");
			};

			conn.onmessage = function(event) {
				//console.log("msg:", event.data);
				var signal = JSON.parse(event.data);
				config.onMessage(signal);
			};

			return conn;
		}

	/* */
	function createTemperatureChart() {
		var chart = c3.generate({
		    bindto: '#js-temp-chart',
		    data: {
					type: 'gauge',
					columns: [
						[ 'data', temperature ]
					]
				},
				gauge: {
					label: {
							format: function(value, ratio) {
								return value;
							}
					},
					min: 0,
					max: 40,
					units: "℃"
				},
				size: {

				},
				color: {
					pattern: [ "#4d88ff", "#4dc2ff", "#ffa54d", "#ff5b4d" ],
					threshold: {
						unit: 'value',
						values: [ 20, 25, 30 ]
					}
				}
		});

		return chart;
	}

	/* */
	function createHumidityChart() {
		var chart = c3.generate({
				bindto: '#js-humid-chart',
				data: {
					type: 'gauge',
					columns: [
						[ 'data', temperature ]
					]
				},
				gauge: {
					label: {
							format: function(value, ratio) {
								return value;
							}
					},
					min: 0,
					max: 100,
					units: "%RH"
				},
				size: {
					
				},
				color: {
					pattern: [ "#7beeff", "#c2ff7b", "#ffd87b" ],
					threshold: {
						unit: 'value',
						values: [ 45, 65 ]
					}
				}
		});

		return chart;
	}

	/* on sensor update */
	function onSigalReceived(signal) {
		//console.log("Temperature:" + signal.t, ", Humidity:" + signal.h);
		tempChart.load({ columns: [['data', signal.t]] });
		humidChart.load({ columns: [['data', signal.h]] });
	}



	(function init() {
		tempChart = createTemperatureChart();
		humidChart = createHumidityChart();
		connection = createConnection({
			url: "ws://" + window.location.hostname + ":8000",
			onMessage: onSigalReceived
		});
	}());

}());
