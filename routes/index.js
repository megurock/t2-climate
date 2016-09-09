var express = require('express');
var router = express.Router();
var ws = require('nodejs-websocket');
var socketServer;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Climate Charts' });
});


/* Create websocket server, provide connection callback */
socketServer = ws.createServer(function(connection) {
    console.log('Accepted new socket connection.');
    connection.on('binary', function(stream) {

        stream.on('data', function(data) {

            // Binary to JSON
            var signal = JSON.parse(data);
            var signal_json = {
                "t": signal.t,
                "h": signal.h
            };
            //console.log('Temperature:' + signal.t + ", Humidity:" + signal.h);

            // JSON to String
            broadcast(JSON.stringify(signal_json));
        });


    });

    connection.on("close", function (code, reason) {
        console.log("Connection closed.");
    });

}).listen(process.env.PORT || 8000);

/**
 * Send a string-type message via web socket to all connections
 */
 function broadcast(str) {
    socketServer.connections.forEach(function(connection) {
        connection.sendText(str);
    })
}

console.log('Socket server listening on port', process.env.PORT || 8000);

module.exports = router;
