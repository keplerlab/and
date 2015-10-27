var stories = require('./stories'),
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
var public = {};
public.init = init;
public.getStories = getStories;
public.listStories = listStories;
public.getAllEntities = getAllEntities;
module.exports = public;
