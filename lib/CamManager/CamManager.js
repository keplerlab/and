var config = require('../../config'),
    WebSocketServer = require('ws').Server;

var _pauseAll = false;

function logger(msg) {
    console.log("CamManager : ", msg);
}

var callbacks = {
    heartbeat: {},
    color: {},
    position: {},
    proximity: {},
    smile: {}
}

function registerBeatCallback(camId, callback) {
    if (!callbacks.heartbeat[camId]) callbacks.heartbeat[camId] = [];
    callbacks.heartbeat[camId].push(callback);
}

function registerColorCallback(camId, callback) {
    if (!callbacks.color[camId]) callbacks.color[camId] = [];
    callbacks.color[camId].push(callback);
}

function registerPositionCallback(camId, callback) {
    if (!callbacks.position[camId]) callbacks.position[camId] = [];
    callbacks.position[camId].push(callback);
}

function registerProximityCallback(camId, callback) {
    if (!callbacks.proximity[camId]) callbacks.proximity[camId] = [];
    callbacks.proximity[camId].push(callback);
}

function registerSmileCallback(camId, callback) {
    if (!callbacks.smile[camId]) callbacks.smile[camId] = [];
    callbacks.smile[camId].push(callback);
}

function removeCallback(callback) {
    function matchcb(cb) {
        return callback != cb;
    }
    for (var i in callbacks)
        for (var j in callbacks[i])
            callbacks[i][j] = callbacks[i][j].filter(matchcb);
}

function pauseAllCallbacks(pauseAll) {
    _pauseAll = pauseAll;
}

function init() {
    var wss = new WebSocketServer({
        port: config.camServerPort
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
                if(config.DEBUG_CAM) 
                    logger(message);
                
                if(_pauseAll) return;
                
                if (callbacks.color[data.id])
                    callbacks.color[data.id].forEach(function (c) {
                        c(data.color);
                    });
                if (callbacks.position[data.id])
                    callbacks.position[data.id].forEach(function (c) {
                        c(data.position);
                    });
                if (callbacks.proximity[data.id])
                    callbacks.proximity[data.id].forEach(function (c) {
                        c(data.proximity);
                    });
                if (callbacks.heartbeat[data.id])
                    callbacks.heartbeat[data.id].forEach(function (c) {
                        c(data.heartbeat);
                    });
                if (callbacks.smile[data.id]) 
                    callbacks.smile[data.id].forEach(function (c) {
                        c(data.smile);
                    });
            }
        });

        ws.on('close', function incoming(message) {
            logger("Client disconnected.");
        });

        logger("Client connected.");
        ws.send(JSON.stringify({msg:'Hello... You are connected to the wall.'}));
    });
}


//=========================
//===== Public Methods ====
//=========================
var public = {};
public.init = init;

public.registerBeatCallback = registerBeatCallback;
public.registerSmileCallback = registerSmileCallback;
public.registerColorCallback = registerColorCallback;
public.registerPositionCallback = registerPositionCallback;
public.registerProximityCallback = registerProximityCallback;
public.removeCallback = removeCallback;
public.pauseAllCallbacks = pauseAllCallbacks;
module.exports = public;
