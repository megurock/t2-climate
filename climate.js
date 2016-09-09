var URL = "ws://192.168.0.6:8000"
//var URL = "ws://t2-ws.herokuapp.com:80";
var interval = 1000;

var tessel = require('tessel');
var climateLib = require('climate-si7020');
var climate = climateLib.use(tessel.port['A']);
var ws = require('nodejs-websocket');
var connection = null;
var stateMap = {
	isWebSocketReady: false,
	isClimateSensorReady: false
};

/**
 *
 */
function startSendingClimateIfReady() {
	var isReady = stateMap.isWebSocketReady && stateMap.isClimateSensorReady;
	if (isReady) {
		console.log("Start sending temperature!");
		sendClimate();
	}
 }

/**
 *
 */
function sendClimate() {
	climate.readTemperature('c', function(err, temp) {
		climate.readHumidity(function(err, humid) {
			var signal = {
				t: temp.toFixed(4),
				h: humid.toFixed(4)
			};

		// connection can be disconnected by this time.
		try {
			connection.sendBinary(new Buffer(JSON.stringify(signal)));
			setTimeout(sendClimate, interval);
		} catch (error) {
			console.log("Error sending signal.", error.message);
		}

	});
	});
}

/**
 *
 */
function onClimateReady() {
	console.log("The tessel climate Module is ready.");
	stateMap.isClimateSensorReady = true;
	startSendingClimateIfReady();
}

/**
 *
 */
function onClimateError(error) {
	stateMap.isClimateSensorReady = false;
	console.log("Error connecting module", error);
}


/**
 *
 */
function initConnection() {
	console.log("Connecting to " + URL);
	connection = ws.connect(URL, function(err) {
		if (err) {
			stateMap.isWebSocketReady = false;
			console.log("Error connecting web socket", err);
			return;
		}

		console.log("Web socket is connected.");
		stateMap.isWebSocketReady = true;
		startSendingClimateIfReady();
	});
}


/**
 * startup
 */
(function init() {
	// Set the binary fragmentation to 1 byte so it instantly sends anything we write to it
	ws.setBinaryFragmentation(1);
	initConnection();
	climate.on('ready', onClimateReady);
	climate.on('error', onClimateError);
}());
