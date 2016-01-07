/*jslint node:true es5:true nomen:true*/
/* console*/

var config = {};

//config.arduinoASerialPort = "/dev/tty.usbmodem14511";
config.arduinoASerialPort = "/dev/tty.usbmodem1411";
config.arduinoASerialBaud = 115200;

config.arduinoBSerialPort = "/dev/tty.usbmodem145431";
config.arduinoBSerialBaud = 115200;

config.arduinoCSerialPort = "/dev/tty.usbmodem145421";
config.arduinoCSerialBaud = 115200;

config.resourcePath = "resources";

config.ResolumeOSCIP = "localhost";
config.MaxOSCIP = "10.10.10.22";

config.ResolumeOSCPort = 7000;
config.ResolumeOSCInPort = 7001;
config.camServerPort = 7002;
config.simulatorServerPort = 7003;
config.MaxOSCPort = 7004;

config.hueBridgeIP = "10.10.10.220";

config.DEBUG_BOARD = true;
config.DEBUG_CAM = false;
config.DEBUG_VIDEO = false;
config.DEBUG_AUDIO = false;
config.DEBUG_SIMULATOR = true;

config.INIT_BOARD = true;
config.INIT_CAM = false;
config.INIT_VIDEO = false;
config.INIT_AUDIO = false;
config.INIT_SIMULATOR = true;

module.exports = config;