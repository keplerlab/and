/*jslint node:true es5:true nomen:true*/
/* console*/

"use strict";

var config = require('../../config'),
    boardConfig = require('./boardConfig');

var _pauseAll = false;

var callbacks = {
    cap: {},
    button: {},
    encoder: {},
    ldr: {},
    piezo: {},
    reed: {}
};

function logger(msg) {
    console.log("Board : ", msg);
}

function onSerialData(data) {
    if (config.DEBUG_BOARD) {
        logger(data);
    }
    data = data.replace(/[\n\r]/g, '');
    try {
        data = JSON.parse(data);
    } catch (e) {
        logger("Invalid Data");
    }

    if (data) {
        var boardID = boardConfig.BOARDS[data.board || "A"].id;

        if (_pauseAll && data.isPausable !== false) {
            return;
        }

        if (callbacks.cap[boardID + data.cap]) {
            callbacks.cap[boardID + data.cap].forEach(function (c) {
                c(data.state);
            });
        }
        if (callbacks.button[boardID + data.button]) {
            callbacks.button[boardID + data.button].forEach(function (c) {
                c(data.state);
            });
        }
        if (callbacks.encoder[boardID + data.encoder]) {
            callbacks.encoder[boardID + data.encoder].forEach(function (c) {
                c(data.state);
            });
        }
        if (callbacks.ldr[boardID + data.ldr]) {
            callbacks.ldr[boardID + data.ldr].forEach(function (c) {
                c(data.state);
            });
        }
        if (callbacks.piezo[boardID + data.piezo]) {
            callbacks.piezo[boardID + data.piezo].forEach(function (c) {
                c(data.state);
            });
        }
        if (callbacks.reed[boardID + data.reed]) {
            callbacks.reed[boardID + data.reed].forEach(function (c) {
                c(data.state);
            });
        }

        /*
        if (callbacks.cap[data.cap])
            while (callbacks.cap[data.cap].length)
                (callbacks.cap[data.cap].shift())(data.state);
        if (callbacks.button[data.button])
            while (callbacks.button[data.button].length)
                (callbacks.button[data.button].shift())(data.state);
        if (callbacks.encoder[data.encoder])
            while (callbacks.encoder[data.encoder].length)
                (callbacks.encoder[data.encoder].shift())(data.state);
        if (callbacks.ldr[data.ldr])
            while (callbacks.ldr[data.ldr].length)
                (callbacks.ldr[data.ldr].shift())(data.state);
        */
    }
}

function initSerialPorts(port, name) {
    port.open(function serialPortHandler(error) {
        if (error) {
            logger(name + ' Failed to open: ' + error);
        } else {
            port.on('data', onSerialData);
        }
    });
}

function init() {
    var i;
    for (i in boardConfig.BOARDS) {
        if (boardConfig.BOARDS.hasOwnProperty(i) && boardConfig.BOARDS[i].active) {
            initSerialPorts(boardConfig.BOARDS[i].port, i);
        }
    }
}

function registerLdrCallback(ldr, callback) {
    var ldrID = ldr.board + ldr.id;
    if (!callbacks.ldr[ldrID]) {
        callbacks.ldr[ldrID] = [];
    }
    callbacks.ldr[ldrID].push(callback);
}

function registerPiezoCallback(piezo, callback) {
    var piezoID = piezo.board + piezo.id;
    if (!callbacks.piezo[piezoID]) {
        callbacks.piezo[piezoID] = [];
    }
    callbacks.piezo[piezoID].push(callback);
}

function registerCapCallback(cap, callback) {
    var capID = cap.board + cap.id;
    if (!callbacks.cap[capID]) {
        callbacks.cap[capID] = [];
    }
    callbacks.cap[capID].push(callback);
}

function registerButtonCallback(button, callback) {
    var buttonID = button.board + button.id;
    if (!callbacks.button[buttonID]) {
        callbacks.button[buttonID] = [];
    }
    callbacks.button[buttonID].push(callback);
}

function registerEncoderCallback(encoder, callback) {
    var encoderID = encoder.board + encoder.id;
    if (!callbacks.encoder[encoderID]) {
        callbacks.encoder[encoderID] = [];
    }
    callbacks.encoder[encoderID].push(callback);
}

function registerReedCallback(reed, callback) {
    var reedID = reed.board + reed.id;
    if (!callbacks.reed[reedID]) {
        callbacks.reed[reedID] = [];
    }
    callbacks.reed[reedID].push(callback);
}

function removeCallback(callback) {
    function matchcb(cb) {
        return callback !== cb;
    }
    var i, j;
    for (i in callbacks) {
        if (callbacks.hasOwnProperty(i)) {
            for (j in callbacks[i]) {
                if (callbacks[i].hasOwnProperty(j)) {
                    callbacks[i][j] = callbacks[i][j].filter(matchcb);
                }
            }
        }
    }
}

function activateServo(servo, callback) {
    callback = callback || function () {};
    var i,
        str = "{S" + servo.id + "}",
        servos = boardConfig.SERVOS;
    for (i = 0; i < servos.length; i += 1) {
        if (servos[i].id === servo.id && servos[i].board === servo.board) {
            boardConfig.BOARDS[servos[i].board].port.write(str, callback);
            logger("Activated Servo " + servo.id);
        }
    }
}

function pauseAllCallbacks(pauseAll) {
    _pauseAll = pauseAll;
}

function simulate(data) {
    onSerialData(data);
}


//=========================
//===== Public Methods ====
//=========================

var board = {};
board.init = init;
board.activateServo = activateServo;
board.registerCapCallback = registerCapCallback;
board.registerButtonCallback = registerButtonCallback;
board.registerEncoderCallback = registerEncoderCallback;
board.registerLdrCallback = registerLdrCallback;
board.registerReedCallback = registerReedCallback;
board.registerPiezoCallback = registerPiezoCallback;

board.simulate = simulate;

board.removeCallback = removeCallback;
board.pauseAllCallbacks = pauseAllCallbacks;

board.SERVOS = boardConfig.SERVOS;
board.CAPS = boardConfig.CAPS;
board.BUTTONS = boardConfig.BUTTONS;
board.ENCODERS = boardConfig.ENCODERS;
board.LDRS = boardConfig.LDRS;
board.PIEZOS = boardConfig.PIEZOS;
board.REEDS = boardConfig.REEDS;

module.exports = board;
