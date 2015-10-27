var config = require('../../config'),
    SerialPort = require("serialport").SerialPort;

var boards = {
    "A": {
        id: "A",
        "active": false,
        port: new SerialPort(config.arduinoASerialPort, {
            baudrate: config.arduinoASerialBaud,
            parser: require("serialport").parsers.readline("\n")
        }, false)
    },
    "B": {
        id: "B",
        "active": false,
        port: new SerialPort(config.arduinoBSerialPort, {
            baudrate: config.arduinoBSerialBaud,
            parser: require("serialport").parsers.readline("\n")
        }, false)
    },
    "C": {
        id: "C",
        "active": false,
        port: new SerialPort(config.arduinoCSerialPort, {
            baudrate: config.arduinoCSerialBaud,
            parser: require("serialport").parsers.readline("\n")
        }, false)
    }
}

var caps = {
    "cap0" : {
        id: 0,
        board: boards.A.id
    }
};

var buttons = {
    "button0" : {
        id: 0,
        board: boards.A.id
    }, 
    "button1" : {
        id: 1,
        board: boards.A.id
    }, 
    "button2" : {
        id: 2,
        board: boards.A.id
    }, 
    "button3" : {
        id: 3,
        board: boards.A.id
    },
    "button4" : {
        id: 4,
        board: boards.A.id
    }, 
    "button5" : {
        id: 5,
        board: boards.A.id
    }, 
    "button6" : {
        id: 6,
        board: boards.A.id
    }, 
    "button7" : {
        id: 7,
        board: boards.A.id
    },
    "button8" : {
        id: 8,
        board: boards.A.id
    }, 
    "button9" : {
        id: 9,
        board: boards.A.id
    }, 
    "button10" : {
        id: 10,
        board: boards.A.id
    }, 
    "button11" : {
        id: 11,
        board: boards.A.id
    },
    "button12" : {
        id: 12,
        board: boards.A.id
    }, 
    "button13" : {
        id: 13,
        board: boards.A.id
    }, 
    "button14" : {
        id: 14,
        board: boards.A.id
    }, 
    "button15" : {
        id: 15,
        board: boards.A.id
    },
    "button16" : {
        id: 16,
        board: boards.A.id
    }, 
    "button17" : {
        id: 17,
        board: boards.A.id
    }, 
    "button18" : {
        id: 18,
        board: boards.A.id
    }, 
    "button19" : {
        id: 19,
        board: boards.A.id
    },
    "button20" : {
        id: 20,
        board: boards.A.id
    }, 
    "button21" : {
        id: 21,
        board: boards.A.id
    }, 
    "button22" : {
        id: 22,
        board: boards.A.id
    }, 
    "button23" : {
        id: 23,
        board: boards.A.id
    }, 
    "button24" : {
        id: 24,
        board: boards.A.id
    }, 
    "button25" : {
        id: 1,
        board: boards.B.id
    }, 
    "button26" : {
        id: 2,
        board: boards.B.id
    }, 
    "button27" : {
        id: 3,
        board: boards.B.id
    }, 
    "button28" : {
        id: 4,
        board: boards.B.id
    }, 
    "button29" : {
        id: 5,
        board: boards.B.id
    }, 
    "button30" : {
        id: 6,
        board: boards.B.id
    }, 
    "button31" : {
        id: 7,
        board: boards.B.id
    },
    "button32" : {
        id: 8,
        board: boards.B.id
    }, 
    "button33" : {
        id: 9,
        board: boards.B.id
    }, 
    "button34" : {
        id: 10,
        board: boards.B.id
    }, 
    "button35" : {
        id: 11,
        board: boards.B.id
    }
};

var encoders = {
    "encoder0" : {
        id: 0,
        board: boards.A.id
    }, 
    "encoder1" : {
        id: 1,
        board: boards.A.id
    }, 
    "encoder2" : {
        id: 2,
        board: boards.A.id
    }, 
    "encoder3" : {
        id: 3,
        board: boards.A.id
    }
};

var ldrs = {
    "ldr0" : {
        id: 0,
        board: boards.A.id
    }, 
    "ldr1" : {
        id: 1,
        board: boards.A.id
    }, 
    "ldr2" : {
        id: 2,
        board: boards.A.id
    }, 
    "ldr3" : {
        id: 3,
        board: boards.A.id
    }, 
    "ldr4" : {
        id: 4,
        board: boards.A.id
    }, 
    "ldr5" : {
        id: 5,
        board: boards.A.id
    }, 
    "ldr6" : {
        id: 6,
        board: boards.A.id,
        isPausable : false
    }
};

var piezos = {
    "piezo0" : {
        id: 0,
        board: boards.C.id
    }, 
    "piezo1" : {
        id: 1,
        board: boards.C.id
    }
};

var reeds = {
    "reed0" : {
        id: 0,
        board: boards.C.id
    },
    "reed1" : {
        id: 1,
        board: boards.C.id
    }
};

var servos = {
    "servo0" : {
        id: 0,
        board: boards.C.id
    }
};


//=========================
//===== Public Methods ====
//=========================

var boardConfig = {};
boardConfig.BOARDS = boards;
boardConfig.CAPS = caps;
boardConfig.BUTTONS = buttons;
boardConfig.ENCODERS = encoders;
boardConfig.SERVOS = servos;
boardConfig.LDRS = ldrs;
boardConfig.PIEZOS = piezos;
boardConfig.REEDS = reeds;

module.exports = boardConfig;
