var config = require('../../config');

var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var host = config.hueBridgeIP,
    username = "newdeveloper",
    api = new HueApi(host, username),
    state;

// Set light state to 'on' with warm white value of 500 and brightness set to 100%
state = lightState.create().on().white(500, 100);

function logger(msg) {
    console.log("HueManager : ", msg);
}

function setHSL(hsl) {
    api.setLightState(1, state, function (err, lights) {
        if (err) throw err;
        displayResult(lights);
    });
}

//=========================
//===== Public Methods ====
//=========================
var public = {};
public.setHSL = setHSL;
module.exports = public;
