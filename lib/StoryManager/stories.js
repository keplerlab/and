var entities = require('./Entities');

var ACTIONS = entities.Functions.actions,
    TRIGGERS = entities.Functions.triggers,
    CLIPS = entities.Arguments.clips,
    AUDIO_CLIPS = entities.Arguments.audioclips,
    LAYERS = entities.Arguments.layers,
    CAPS = entities.Arguments.caps,
    BUTTONS = entities.Arguments.buttons,
    ENCODERS = entities.Arguments.encoders,
    LDRS = entities.Arguments.ldrs,
    SERVOS = entities.Arguments.servos,
    REEDS = entities.Arguments.reeds,
    PIEZOS = entities.Arguments.piezos;


var stories = {
    /*
        "shelf": {
            timeout: 100000,
            states: {
                initial: {
                    clips: [],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrhigh,
                            arg: LDRS.ldr0
                        },
                        action: "musicA"
                    }, {
                        trigger: {
                            type: TRIGGERS.ldrhigh,
                            arg: LDRS.ldr1
                        },
                        action: "musicB"
                    }, {
                        trigger: {
                            type: TRIGGERS.ldrhigh,
                            arg: LDRS.ldr2
                        },
                        action: "musicC"
                    }, {
                        trigger: {
                            type: TRIGGERS.ldrhigh,
                            arg: LDRS.ldr3
                        },
                        action: "musicD"
                    }, {
                        trigger: {
                            type: TRIGGERS.ldrhigh,
                            arg: LDRS.ldr4
                        },
                        action: "musicE"
                    }, {
                        trigger: {
                            type: TRIGGERS.ldrhigh,
                            arg: LDRS.ldr5
                        },
                        action: "musicF"
                    }]
                },
                musicA: {
                    clips: [{
                        audio: AUDIO_CLIPS.SongA
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrlow,
                            arg: LDRS.ldr0
                        },
                        action: "nomusic"
                    }]
                },
                musicB: {
                    clips: [{
                        audio: AUDIO_CLIPS.SongB
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrlow,
                            arg: LDRS.ldr1
                        },
                        action: "nomusic"
                    }]
                },
                musicC: {
                    clips: [{
                        audio: AUDIO_CLIPS.SongC
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrlow,
                            arg: LDRS.ldr2
                        },
                        action: "nomusic"
                    }]
                },
                musicD: {
                    clips: [{
                        audio: AUDIO_CLIPS.SongD
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrlow,
                            arg: LDRS.ldr3
                        },
                        action: "nomusic"
                    }]
                },
                musicE: {
                    clips: [{
                        audio: AUDIO_CLIPS.SongE
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrlow,
                            arg: LDRS.ldr4
                        },
                        action: "nomusic"
                    }]
                },
                musicF: {
                    clips: [{
                        audio: AUDIO_CLIPS.SongF
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.ldrlow,
                            arg: LDRS.ldr5
                        },
                        action: "nomusic"
                    }]
                },
                nomusic: {
                    clips: [{
                        audio: AUDIO_CLIPS.Thanks
                    }],
                    functions: [{
                        trigger: {
                            type: TRIGGERS.wait,
                            arg: 0
                        },
                        action: "initial"
                    }]
                }
            },
            functions: []
        }*/
};

//=========================
//===== Public Methods ====
//=========================
var public = {};
public.stories = stories;
module.exports = public;
