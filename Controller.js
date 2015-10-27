var config = require('./config'),
    http = require('http'),
    machina = require('machina'),
    board = require('./lib/Board/Board'),
    entities = require('./lib/StoryManager/Entities'),
    camMgr = require('./lib/CamManager/CamManager'),
    storyMgr = require('./lib/StoryManager/StoryManager'),
    videoMgr = require('./lib/VideoManager/VideoManager'),
    audioMgr = require('./lib/AudioManager/AudioManager'),
    hueMgr = require('./lib/HueManager/HueManager'),
    simulator = require('./lib/Simulator/SimulatorServer');

var lastColor = {},
    fsms = [];

var Functions = {
    triggers: {
        touch: function touch(touch, callback) {
            function touchcb(s) {
                if (s == "touched") callback();
            }
            board.registerButtonCallback(touch, touchcb);
            return touchcb;
        },
        layerend: function layerend(layer, callback) {
            function layercb(res) {
                callback(res)
            }
            videoMgr.registerLayerEnd(layer, layercb);
            return layercb;
        },
        wait: function wait(millisec, callback) {
            return setTimeout(callback, millisec);
        },
        ldrhigh: function ldr(ldr, callback) {
            function ldrcb(s) {
                if (s == "high") callback();
            }
            board.registerLdrCallback(ldr, ldrcb);
            return ldrcb;
        },
        ldrlow: function ldr(ldr, callback) {
            function ldrcb(s) {
                if (s == "low") callback();
            }
            board.registerLdrCallback(ldr, ldrcb);
            return ldrcb;
        },
        reed: function reed(reed, callback) {
            function reedcb(s) {
                if (s == "high") callback();
            }
            board.registerReedCallback(reed, reedcb);
            return reedcb;
        },
        piezo: function piezo(piezo, callback) {
            function piezocb(s) {
                if (s == "high") callback();
            }
            board.registerPiezoCallback(piezo, piezocb);
            return piezocb;
        },
        proximity: function proximity(camId, callback) {
            function proxcb(s) {
                if (s == 1) callback();
            }
            camMgr.registerProximityCallback(camId, proxcb);
            return proxcb;
        },
        no_proximity: function proximity(camId, callback) {
            function proxcb(s) {
                if (s == 0) callback();
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
                if (s == 1) callback();
            }
            camMgr.registerSmileCallback(camId, smilecb);
            return smilecb;
        },
        noise: function noise(micId, callback) {
            function noisecb(a, d) {
                callback(a, d);
            }
            audioMgr.registerNoiseCallback(micId, noisecb);
            return noisecb;
        }
    },
    actions: {
        connectclip: function connectclip(clip) {
            videoMgr.connectClip(clip);
        },
        clearLayer: function clearLayer(layer) {
            videoMgr.clearLayer(layer);
        },
        playAudio: function connectclip(clip) {
            audioMgr.start(clip);
        },
        stopAudio: function connectclip(clip) {
            audioMgr.stop(clip);
        },
        activateServo: function activateServo(servo) {
            board.activateServo(servo);
        },
        updateColor: function updateColor(clip) {
            videoMgr.setHSL(clip, lastColor);
        },
        removeColor: function updateColor(clip) {
            videoMgr.setHSL(clip, lastColor = {});
        },
        resetStory: function resetStory(story) {
            videoMgr.clearAll();
            for (var i in fsms) {
                fsms[i].transition("uninitialized");
                fsms[i].reset();
            }
            board.pauseAllCallbacks(false);
            camMgr.pauseAllCallbacks(false);
            audioMgr.stopAll();
        },
        hue: function hue(hsl) {
            hueMgr.setHSL(hsl);
        }
    }
}

function logger(msg) {
    console.log("Controller : ", msg);
}

function applyFunc(func, isGlobal) {
    var trigger = func.trigger || "",
        mtrigger = Functions.triggers[trigger.type],
        autoRemove = (trigger.autoRemove != false);

    if (trigger.isJackpot == true) {
        audioMgr.stopAll();
    }
    cb = function callback() {
        if (trigger.isJackpot == true) {
            board.pauseAllCallbacks(true);
            camMgr.pauseAllCallbacks(true);
            //audioMgr.stopAll();
            //clearTriggers(this.triggers, true);
        }
        this.handle("next", func.action);
    }.bind(this);
    cb = mtrigger(trigger.arg, cb) || cb;
    if (mtrigger) {
        cb.autoRemove = (!isGlobal && autoRemove);
        this.triggers.push(cb);
    }

}

function getStoryStates(state, timeout) {
    var states = {};
    this.triggers = [];

    states.next = function (nextState) {
        console.log("Try transition to state : ", nextState);
        this.transition(nextState);
    }

    states._onEnter = function () {
        if (state.functions && state.functions.length)
            state.functions.forEach(applyFunc.bind(this));
        console.log("Current State : ", this.state);
        this.handle("runStory");
        //this.resetTimer = setTimeout(function () {
        //    this.transition("initial");
        //}.bind(this), timeout || 10000);
    }

    states.runStory = function runStory() {
        for (var i in state.clips) {
            if (typeof (state.clips[i].clip) != "undefined")
                Functions.actions.connectclip(state.clips[i].clip);
            if (typeof (state.clips[i].audio) != "undefined")
                Functions.actions.playAudio(state.clips[i].audio);
            if (typeof (state.clips[i].clearaudio) != "undefined")
                Functions.actions.stopAudio(state.clips[i].clearaudio);
            if (typeof (state.clips[i].servo) != "undefined")
                Functions.actions.activateServo(state.clips[i].servo);
            if (typeof (state.clips[i].clear) != "undefined")
                Functions.actions.clearLayer(state.clips[i].clear);
            if (typeof (state.clips[i].updateColor) != "undefined")
                Functions.actions.updateColor(state.clips[i].updateColor);
            if (typeof (state.clips[i].removeColor) != "undefined")
                Functions.actions.removeColor(state.clips[i].removeColor);
            if (typeof (state.clips[i].resetStory) != "undefined")
                Functions.actions.resetStory(state.clips[i].resetStory);
        }
    };

    states._onExit = function () {
        clearTriggers(this.triggers);
        //clearTimeout(this.resetTimer);
    }

    return states;
}

function clearTriggers(triggers, forceClear) {
    for (var t; t = triggers.shift();) {
        if (t.autoRemove || forceClear) {
            videoMgr.removeCallback(t);
            camMgr.removeCallback(t);
            board.removeCallback(t);
            clearTimeout(t);
        }
    }
}

function startStories() {
    var stories = storyMgr.getStories();
    for (var storyName in stories) {
        var states = stories[storyName].states,
            timeout = stories[storyName].timeout,
            gfuncs = stories[storyName].functions;

        var storyFSM = new machina.Fsm({
            initialize: function (options) {},
            namespace: storyName,
            states: {
                uninitialized: {
                    "*": function () {
                        this.deferUntilTransition();
                        //this.transition("initial");
                    }
                }
            },
            reset: function () {
                //this.handle("_reset");
                this.transition("initial");
            }
        });

        for (var statename in states)
            storyFSM.states[statename] =
            getStoryStates.bind(storyFSM)(states[statename], timeout);

        //for (var i in gfuncs)
        //applyFunc.bind(storyFSM)(gfuncs[i], true);

        storyFSM.initialState = storyFSM.states.uninitialized;
        storyFSM.reset();

        fsms.push(storyFSM);

        console.log("Initialized Story : " + storyName);
    }
}

function init() {
    setTimeout(function () {
        if (config.INIT_BOARD) board.init();
        if (config.INIT_VIDEO) videoMgr.init();
        if (config.INIT_CAM) camMgr.init();
        if (config.INIT_AUDIO) audioMgr.init();
        if (config.INIT_SIMULATOR) simulator.init();
        logger("Controller Started. Initializing Stories...");
        startStories();
    }, 1000);
}

init();

//=========================
//===== Public Methods ====
//=========================
var controller = {};
module.exports = controller;
