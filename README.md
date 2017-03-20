# 'AND' Framework
`and` is a framework written in node, that allows you to integrate various technologies spanning across the IoT world. It implements stories in the form of finite state machines. 

## Table of Contents
- [Prerequisite](#prerequisite)
- [Features](#features)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Platform Packages](#platform-packages)
- [Testing](#testing)
- [Source Code Overview](#source-code-overview)
  - [Controller](#controller)
  - [Configuration](#configuration)
  - [Video Manager](#video-manager)
  - [Story Manager](#story-manager)
  - [Hue Manager](#hue-manager)
  - [Cam Manager](#cam-manager)
  - [Board](#board)
  - [Audio Manager](#audio-manager)
- [Known Issues](#known-issues)
- [Reaching Out](#reaching-out)

## Prerequisite 

- Python 2.7.12
- NodeJS 6.9.4

## Features 

## Installation

### Requirements

To install the necessary dependencies, run following command

```nodejs
npm install
```
### Platform Packages
Above command will install following dependencies:
```shell
    "lame": "1.2.4",
    "machina": "2.0.0",
    "node-hue-api": "1.1.2",
    "osc-min": "1.1.1",
    "serialport": "4.0.7",
    "speaker": "0.2.6",
    "ws": "2.0.3",
    "youtube-api": "2.0.6",
    "speaker": "0.3.0"
```

## Testing

To get started, run the Controller.js from the project repository.

```nodejs
node Controller.js
```

If above code runs without any error, you have successfully installed 'and' framework on your machine and you are all set to include your stories and integrate any other program.

## Source Code Overview

'and' framework source code is quite modular.

### Controller

Controller(controller.js) is the entry point for your application. It initializes all subsystem that is required. 

### Configuration

Configuration(config.js) is the file where you can change your application configuration. For example, you can define the port on which your hardware boards are connected. In addition to defining the port of various external hardware/software, you can also define what all feature of the framework you want to run. You can choose to run only video, only audio or choose to run all the features.

### Video Manager

Video Manager folder has two files 1) map.js 2) VideoManager.js . map.js is for mapping layer and clip. While developing this framework, Resolume was used for managing videos. VideoManager.js manages all the video interaction based on the command recevied from other module.

#### Adding layers and clips

### Story Manager

Story Manager folder has three files 1) Entities.js 2) stories.json 3) StoryManager.js . Entities.js has all the triggers and actions defined. stories.json is the place where you can define all your stories in json format. StoryManager.js manages the stories. It loads stories and pass it to the required modules.

#### Updating stories

### Hue Manager

Hue Manager is for managing Philips Hue Bridge and Lights.

### Cam Manager

Cam Manager has two files 1) CamManager.js 2) Capture.js CamManager manages data received from websocket regarding color, position, proximity, heartbeat and smile. Capture.js is not currently used anywhere.

### Board

Board folder has two files 1) Board.js 2) boardConfig.js Board.js manages all the interaction with board starting from initializing serial port to registering callback based on the data received from the boards. In boardconfig.js you can define all connected sensors and map them accordingly. 

### Audio Manager

AudioManager has three files 1) audioConfig.js 2) AudioManager.js 3) map.js In audioConfig.js you can do audio specific configuration. AudioManager.js manages all the audio and prepare appropriate OSC command. For managing Audio we used Max IP software. map.js is for mapping audio files/layers with the code.

## Known issues

We don't find any issues as of now, but we'll be glab in case anyone find any issue and update us via email IndiaStudio-Kepler@sapient.com

## Reaching Out

Doing anything interesting or want to share your favorite tips and tricks? 
Feel free to reach out with ideas for features or requests.
