var LAYERS = {
    "PlaylistA": "Songs",
}

var CLIPS = {
    "SongA": {
        "name": "1.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    },
    "SongB": {
        "name": "2.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    },
    "SongC": {
        "name": "3.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    },
    "SongD": {
        "name": "4.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    },
    "SongE": {
        "name": "5.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    },
    "SongF": {
        "name": "6.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    },
    "Thanks": {
        "name": "t.mp3",
        "layer": LAYERS.PlaylistA,
        "isFile":true
    }
}

//=========================
//===== Public Methods ====
//=========================
var public = {};
public.LAYERS = LAYERS;
public.CLIPS = CLIPS;
module.exports = public;