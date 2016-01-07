/*jslint node:true es5:true nomen:true*/
/* console*/

"use strict";

var fs = require('fs'),
    config = require('../../config'),
    board = require('../Board/Board'),
    WebSocketServer = require('ws').Server;

function logger(msg) {
    if (config.DEBUG_SIMULATOR) {
        console.log("Simulator : ", msg);
    }
}

function init() {
    var wss = new WebSocketServer({
        port: config.simulatorServerPort
    });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            var data;
            try {
                data = JSON.parse(message);
            } catch (e) {
                logger(e);
            }
            if (data) {
                //logger(message);
                board.simulate(message);
            }
        });

        ws.on('close', function incoming(message) {
            logger("Client disconnected.");
        });

        logger("Client connected.");
        ws.send(JSON.stringify({
            msg: 'Hello... You are connected to the wall simulator.'
        }));
    });

    logger("Simluator Server listening at " + config.simulatorServerPort);
}


//=========================
//===== Public Methods ====
//=========================
var SimulatorServer = {};
SimulatorServer.init = init;
module.exports = SimulatorServer;
