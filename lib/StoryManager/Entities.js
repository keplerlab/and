/*jslint node:true es5:true nomen:true*/
/* console*/

"use strict";

var board = require('../Board/Board'),
    camMgr = require('../CamManager/CamManager'),
    amgr = require('../AudioManager/AudioManager'),
    vmgr = require('../VideoManager/VideoManager'),
    hueMgr = require('../HueManager/HueManager');

var lastColor;

var Functions = {
    triggers: {
        touch: function (touch, callback) {
            function touchcb(s) {
                if (s === "touched") {
                    callback();
                }
            }
            board.registerButtonCallback(touch, touchcb);
            return touchcb;
        },
        layerend: function layerend(layer, callback) {
            function layercb(res) {
                callback(res);
            }
            vmgr.registerLayerEnd(layer, layercb);
            return layercb;
        },
        wait: function wait(millisec, callback) {
            return setTimeout(callback, millisec);
        },
        ldrhigh: function (ldr, callback) {
            function ldrcb(s) {
                if (s === "high") {
                    callback();
                }
            }
            board.registerLdrCallback(ldr, ldrcb);
            return ldrcb;
        },
        ldrlow: function (ldr, callback) {
            function ldrcb(s) {
                if (s === "low") {
                    callback();
                }
            }
            board.registerLdrCallback(ldr, ldrcb);
            return ldrcb;
        },
        reed: function (reed, callback) {
            function reedcb(s) {
                if (s === "high") {
                    callback();
                }
            }
            board.registerReedCallback(reed, reedcb);
            return reedcb;
        },
        piezo: function (piezo, callback) {
            function piezocb(s) {
                if (s === "high") {
                    callback();
                }
            }
            board.registerPiezoCallback(piezo, piezocb);
            return piezocb;
        },
        proximity: function proximity(camId, callback) {
            function proxcb(s) {
                if (s === 1) {
                    callback();
                }
            }
            camMgr.registerProximityCallback(camId, proxcb);
            return proxcb;
        },
        no_proximity: function proximity(camId, callback) {
            function proxcb(s) {
                if (s === 0) {
                    callback();
                }
            }
            camMgr.registerProximityCallback(camId, proxcb);
            return proxcb;
        },
        color: function color(camId, callback) {
            function colorcb(s) {
                lastColor = s;
                callback();
            }
            camMgr.registerColorCallback(camId, colorcb);
            return colorcb;
        },
        smile: function smile(camId, callback) {
            function smilecb(s) {
                if (s === 1) {
                    callback();
                }
            }
            camMgr.registerSmileCallback(camId, smilecb);
            return smilecb;
        },
        noise: function noise(micId, callback) {
            function noisecb(a, d) {
                callback(a, d);
            }
            amgr.registerNoiseCallback(micId, noisecb);
            return noisecb;
        }
    },
    actions: {
        connectclip: function connectclip(clip) {
            vmgr.connectClip(clip);
        },
        clearLayer: function clearLayer(layer) {
            vmgr.clearLayer(layer);
        },
        playAudio: function connectclip(clip) {
            amgr.start(clip);
        },
        stopAudio: function connectclip(clip) {
            amgr.stop(clip);
        },
        activateServo: function activateServo(servo) {
            board.activateServo(servo);
        },
        updateColor: function updateColor(clip) {
            vmgr.setHSL(clip, lastColor);
        },
        removeColor: function updateColor(clip) {
            vmgr.setHSL(clip, lastColor = {});
        },
        hue: function hue(hsl) {
            hueMgr.setHSL(hsl);
        }
    }
};

var Arguments = {
    buttons: board.BUTTONS,
    servos: board.SERVOS,
    caps: board.CAPS,
    encoders: board.ENCODERS,
    clips: vmgr.CLIPS,
    audioclips: amgr.CLIPS,
    layers: vmgr.LAYERS,
    ldrs: board.LDRS,
    piezos: board.PIEZOS,
    reeds: board.REEDS
};

//=========================
//===== Public Methods ====
//=========================
var Entities = {};
Entities.Functions = Functions;
Entities.Arguments = Arguments;
module.exports = Entities;
