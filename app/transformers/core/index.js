/* 
    This file is simply meant to be an aggregator of all core transformer related functions *listed alphabetically.*
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
const CommonTransformer = require("./CommonTransformer");
const PersonalityQuestionTransformer = require("./PersonalityQuestionTransformer");

//* EXPORTS
module.exports = {
  CommonTransformer,
  PersonalityQuestionTransformer,
};
