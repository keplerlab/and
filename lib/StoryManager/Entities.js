var board = require('../Board/Board'),
    camMgr = require('../CamManager/CamManager'),
    amgr = require('../AudioManager/AudioManager'),
    vmgr = require('../VideoManager/VideoManager');

var Functions = {
    triggers: {
        touch: "touch",
        layerend: "layerend",
        ldrhigh: "ldrhigh",
        ldrlow: "ldrlow",
        piezo: "piezo",
        reed: "reed",
        wait: "wait",
        heartbeat: "heartbeat",
        proximity: "proximity",
        no_proximity: "no_proximity",
        position: "position",
        color: "color",
        smile: "smile",
        noise: "noise"
    },
    actions: {
        connectclip: "connectclip",
        clearLayer: "clearLayer",
        activateServo:"activateServo",
        playAudio:"playAudio",
        stopAudio:"stopAudio",
        updateColor:"updateColor",
        removeColor:"removeColor",
        resetStory:"resetStory"
    }
}

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
}

//=========================
//===== Public Methods ====
//=========================
var public = {};
public.Functions = Functions;
public.Arguments = Arguments;
module.exports = public;
