/*jslint node:true es5:true nomen:true*/
/* console*/

"use strict";

var config = require('./config'),
    http = require('http'),
    machina = require('machina'),
    lib = require('./lib');

var lastColor = {},
    fsms = [],
    Functions = lib.storyMgr.Functions,
    Arguments = lib.storyMgr.Arguments;

function logger(msg) {
    console.log("Controller : ", msg);
}

function resetStory(story) {
    lib.videoMgr.clearAll();
    var i;
    for (i = 0; i < fsms.length; i += 1) {
        fsms[i].transition("uninitialized");
        fsms[i].reset();
    }
    lib.board.pauseAllCallbacks(false);
    lib.camMgr.pauseAllCallbacks(false);
    lib.audioMgr.stopAll();
}

function ApplyFunc(func, isGlobal) {
    var cb,
        trigger = func.trigger || "",
        mtrigger = Functions.triggers[trigger.type],
        autoRemove = (trigger.autoRemove !== false);

    if (trigger.isJackpot === true) {
        lib.audioMgr.stopAll();
    }
    cb = function callback() {
        if (trigger.isJackpot === true) {
            lib.board.pauseAllCallbacks(true);
            lib.camMgr.pauseAllCallbacks(true);
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

function clearTriggers(triggers, forceClear) {
    var t;
    do {
        t = triggers.shift();
        if (t.autoRemove || forceClear) {
            lib.videoMgr.removeCallback(t);
            lib.camMgr.removeCallback(t);
            lib.board.removeCallback(t);
            clearTimeout(t);
        }
    } while (t);
}

function RunState() {
    var i,
        state = this;
    for (i = 0; i < state.clips; i += 1) {
        if (typeof (state.clips[i].clip) !== "undefined") {
            Functions.actions.connectclip(state.clips[i].clip);
        }
        if (typeof (state.clips[i].audio) !== "undefined") {
            Functions.actions.playAudio(state.clips[i].audio);
        }
        if (typeof (state.clips[i].clearaudio) !== "undefined") {
            Functions.actions.stopAudio(state.clips[i].clearaudio);
        }
        if (typeof (state.clips[i].servo) !== "undefined") {
            Functions.actions.activateServo(state.clips[i].servo);
        }
        if (typeof (state.clips[i].clear) !== "undefined") {
            Functions.actions.clearLayer(state.clips[i].clear);
        }
        if (typeof (state.clips[i].updateColor) !== "undefined") {
            Functions.actions.updateColor(state.clips[i].updateColor);
        }
        if (typeof (state.clips[i].removeColor) !== "undefined") {
            Functions.actions.removeColor(state.clips[i].removeColor);
        }
        if (typeof (state.clips[i].resetStory) !== "undefined") {
            resetStory(state.clips[i].resetStory);
        }
    }
}

function ExitState() {
    clearTriggers(this.triggers);
    //clearTimeout(this.resetTimer);
}

function StoryStateGenerator(state, timeout) {
    var states = {};
    this.triggers = [];

    states.next = function (nextState) {
        console.log("Try transition to state : ", nextState);
        this.transition(nextState);
    };

    states._onEnter = function () {
        if (state.functions && state.functions.length) {
            state.functions.forEach(ApplyFunc.bind(this));
        }
        console.log("Current State : ", this.state);
        this.handle("_runState");
        //this.resetTimer = setTimeout(function () {
        //    this.transition("initial");
        //}.bind(this), timeout || 10000);
    };

    states._runState = RunState.bind(state);
    states._onExit = ExitState.bind(state);

    return states;
}

function startStories() {
    var stories = lib.storyMgr.getStories(),
        storyName,
        states,
        timeout,
        gfuncs,
        storyFSM,
        statename;

    function InitForAll(options) {}

    function DefaultSateForAll() {
        this.deferUntilTransition();
        //this.transition("initial");
    }

    function ResetAll() {
        //this.handle("_reset");
        this.transition("initial");
    }

    for (storyName in stories) {
        if (stories.hasOwnProperty(storyName)) {

            states = stories[storyName].states;
            timeout = stories[storyName].timeout;
            gfuncs = stories[storyName].functions;

            storyFSM = new machina.Fsm({
                initialize: InitForAll,
                namespace: storyName,
                states: {
                    uninitialized: {
                        "*": DefaultSateForAll
                    }
                },
                reset: ResetAll
            });

            for (statename in states) {
                if (states.hasOwnProperty(statename)) {
                    storyFSM.states[statename] =
                        StoryStateGenerator.bind(storyFSM)(states[statename], timeout);
                }
            }
            //for (var i in gfuncs)
            //applyFunc.bind(storyFSM)(gfuncs[i], true);

            storyFSM.initialState = storyFSM.states.uninitialized;
            storyFSM.reset();
            fsms.push(storyFSM);
            console.log("Initialized Story : " + storyName);
        }
    }
}

function init() {
    setTimeout(function () {
        if (config.INIT_BOARD) {
            lib.board.init();
        }
        if (config.INIT_VIDEO) {
            lib.videoMgr.init();
        }
        if (config.INIT_CAM) {
            lib.camMgr.init();
        }
        if (config.INIT_AUDIO) {
            lib.audioMgr.init();
        }
        if (config.INIT_SIMULATOR) {
            lib.simulator.init();
        }
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
