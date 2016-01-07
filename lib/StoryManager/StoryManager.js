/*jslint node:true es5:true nomen:true*/
/* console*/

"use strict";

var stories = require('./stories.json'),
    entities = require('./Entities');

function logger(msg) {
    console.log("StoryManager : ", msg);
}

function init() {

}

function initStory() {


}

function getStories() {
    return stories.stories;
}

function listStories() {

}

function getAllEntities() {
    return {
        Arguments: entities.Arguments,
        Functions: {
            triggers: Object.keys(entities.Functions.triggers),
            actions: Object.keys(entities.Functions.actions)
        }
    };
}

//=========================
//===== Public Methods ====
//=========================
var StoryManager = {};
StoryManager.init = init;
StoryManager.getStories = getStories;
StoryManager.listStories = listStories;
StoryManager.getAllEntities = getAllEntities;
module.exports = StoryManager;
