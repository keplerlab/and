var osc = require('osc-min'),
    dgram = require('dgram'),
    path = require('path'),
    config = require('../../config'),
    map = require('./map');

var udp, server, callbacks;

function logger(msg) {
    if (config.DEBUG_VIDEO)
        console.log("VideoManager : ", msg);
}

function init() {
    udp = dgram.createSocket("udp4");
    server = dgram.createSocket('udp4');
    callbacks = {
        layerend: []
    };

    initServer();
    clearAll();
}

function setPosition(clip, value) {
    var pos = path.join("/", clip.layer, clip.name, 'video', 'position', 'values');
    sendOSC(pos, map.TYPES.FLOAT, value || 0);
}

function connectClip(clip, value) {
    var con = path.join("/", clip.layer, clip.name, 'connect');
    sendOSC(con, map.TYPES.INT, value || 1);
}

function clearLayer(layer, value) {
    var address = path.join("/", layer, "clear");
    sendOSC(address, map.TYPES.INT, value || 1);
}

function clearAll() {
    var address = path.join("/", 'composition', "disconnectall");
    sendOSC(address, map.TYPES.INT, 1);
}

function setHSL(clip, HSLvalue) {

    if (HSLvalue) {
        var pos = path.join("/", clip.layer, clip.name, 'video', 'effect1', 'param1', 'values');
        sendOSC(pos, map.TYPES.FLOAT, HSLvalue.H || 0.57);
        pos = path.join("/", clip.layer, clip.name, 'video', 'effect1', 'param2', 'values');
        sendOSC(pos, map.TYPES.FLOAT, HSLvalue.S || 0.53);
        pos = path.join("/", clip.layer, clip.name, 'video', 'effect1', 'param3', 'values');
        sendOSC(pos, map.TYPES.FLOAT, HSLvalue.L || 0.26);

        console.log('pahunch gya');
    }
}

function triggerLink(link, value) {
    var address = path.join("/", link.layer, link.name, 'values');
    sendOSC(address, map.TYPES.FLOAT, value || 0);
}

function sendOSC(address, type, value) {
    var params = {};
    params.address = address;
    params.args = [{
        type: type,
        value: value
    }];

    var buf = osc.toBuffer(params);
    logger("Invoking Resolume : " + params.address);
    udp.send(buf, 0, buf.length, config.ResolumeOSCPort, config.ResolumeOSCIP);
}

//=====================
//===== OSC Server ====
//=====================

function initServer() {
    var pattern_layer = /(layer\d+)(?=\/video\/position\/values)/ig;

    server.on('listening', function () {
        var address = server.address();
        logger('OSC Server listening on ' + address.address + ":" + address.port);
    });

    server.on('message', function (message, remote) {
        message = osc.fromBuffer(message);
        var path = message["address"],
            args = message["args"];

        if (args && args.length) args = args[0];

        var matched;
        if (!!(matched = path.match(pattern_layer))) {
            var layerid = matched[0];
            if (args["value"] == 1) {
                if (callbacks.layerend[layerid])
                //while (callbacks.layerend[layerid].length)
                //    (callbacks.layerend[layerid].shift())(args["value"]);
                    callbacks.layerend[layerid].forEach(function (c) {
                    c(args["value"]);
                });
            }
        }
    });
    server.bind(config.ResolumeOSCInPort, '0.0.0.0');
}

function registerLayerEnd(layerID, callback) {
    if (!callbacks.layerend[layerID]) callbacks.layerend[layerID] = [];
    callbacks.layerend[layerID].push(callback);
}

function removeCallback(callback) {
    function matchcb(cb) {
        return callback != cb;
    }
    for (var i in callbacks)
        callbacks[i] = callbacks[i].filter(matchcb);
}


//=========================
//===== Public Methods ====
//=========================
var public = {};

public.init = init;
public.connectClip = connectClip;
public.setHSL = setHSL;
public.clearLayer = clearLayer;
public.clearAll = clearAll;
public.triggerLink = triggerLink;
public.sendOSC = sendOSC;
public.registerLayerEnd = registerLayerEnd;

public.removeCallback = removeCallback;

public.STATES = map.STATES;
public.CLIPS = map.CLIPS;
public.LAYERS = map.LAYERS;
public.LINKS = map.LINKS;

module.exports = public;
