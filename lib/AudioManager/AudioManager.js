var osc = require('osc-min'),
    dgram = require('dgram'),
    path = require('path'),
    childProc = require('child_process'),
    Speaker = require('speaker'),
    fs = require('fs'),
    lame = require('lame'),
    config = require('../../config'),
    audioConfig = require('./audioConfig'),
    map = require('./map');

var udp;
var _pauseAll = false;

var openPipe, speaker;

var callbacks = {
    noise: {}
}

function logger(msg) {
    if (config.DEBUG_AUDIO)
        console.log("AudioManager : ", msg);
}

function init() {
    udp = dgram.createSocket("udp4");
    //captureAudio();

    speaker = new Speaker({
        channels: 2,
        bitDepth: 16,
        sampleRate: 44100
    })
}

/* Audio In Methods */
function captureAudio() {
    var opts = ['-n', 'trim', '0', audioConfig.SAMPLE_LENGTH, 'stat'];
    var child = childProc.execFile('rec', opts, onAudioStat);
}

function registerNoiseCallback(micId, callback) {
    if (!callbacks.noise[micId]) callbacks.noise[micId] = [];
    callbacks.noise[micId].push(callback);
}

function removeCallback() {
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

function onAudioStat(err, stdout, stderr) {
    var maxDelta = stderr.match(/Maximum delta:[\D]*[\d].[\d]+/ig),
        maxAmp = stderr.match(/Maximum amplitude:[\D]*[\d].[\d]+/ig);

    var dval = -1,
        aval = -1;

    if (maxDelta && maxDelta[0])
        dval = maxDelta[0].match(/[\d].[\d]+/ig);
    if (maxAmp && maxAmp[0])
        aval = maxAmp[0].match(/[\d].[\d]+/ig);

    if (dval.length) dval = parseFloat(dval[0]);
    if (aval.length) aval = parseFloat(aval[0]);

    if (!_pauseAll)
        if (dval >= audioConfig.DELTA_THRESHOLD &&
            aval >= audioConfig.AUDIO_THRESHOLD)
            if (callbacks.noise[0])
                callbacks.noise[0].forEach(function (c) {
                    c(aval, dval);
                });
            /*
            if(dval >= audioConfig.DELTA_THRESHOLD &&  
                    aval >= audioConfig.AUDIO_THRESHOLD) logger("----------->")
            */

    logger(dval + "," + aval);
    captureAudio();
}

/* Audio Out Methods */
function start(clip) {
    if (clip.isFile)
        playFile(clip);
    else
        sendOSC("start", [clip.layer, clip.name]);
}

function stop(clip) {
    if (clip.isFile)
        stopFile(clip);
    else
        sendOSC("stop", [clip.layer]);
}

function stopAll() {
    sendOSC("stopAll", []);
}

function playFile(clip) {

    if (openPipe) {
        openPipe.unpipe(speaker);
        openPipe = null;
    }

    var file = path.join(config.resourcePath, clip.name);
    var stream = fs.createReadStream(file);
    var decoder = new lame.Decoder();

    openPipe = stream.pipe(decoder);
    openPipe.pipe(speaker,{ end: false });
}

function stopFile(clip) {
    // To Do
}

function sendOSC(address, args) {
    var params = {};
    params.address = address;
    params.args = args;

    var buf = osc.toBuffer(params);
    logger("Invoking Max : " + params.address + " with Args : " + args.join(","));
    udp.send(buf, 0, buf.length, config.MaxOSCPort, config.MaxOSCIP);
}


//=========================
//===== Public Methods ====
//=========================
var public = {};

public.init = init;
public.registerNoiseCallback = registerNoiseCallback;
public.removeCallback = removeCallback;
public.pauseAllCallbacks = pauseAllCallbacks;

public.start = start;
public.stop = stop;
public.stopAll = stopAll;

public.CLIPS = map.CLIPS;
public.LAYERS = map.LAYERS;

module.exports = public;
