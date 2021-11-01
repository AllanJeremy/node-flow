"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let insertData = [
      {
        prompt: {
          id: 1,
          question: "How are you feeling today?",
          is_multiple_choice: true,
          is_active: true,
        },
        options: [
          { text: "Content", emoji: "😊" },
          { text: "Lonely", emoji: "😢" },
          { text: "Uncertain", emoji: "😐" },
          { text: "Excited", emoji: "😁" },
          { text: "Anxious", emoji: "🙁" },
          { text: "Other", emoji: null },
        ].map((val) => {
          val.prompt_id = 1;
          return val;
        }),
      },
      {
        prompt: {
          id: 2,
          question: "What do you need today?",
          is_multiple_choice: true,
          is_active: true,
        },
        options: [
          { text: "Space to vent", emoji: null },
          { text: "Support", emoji: null },
          { text: "Advice", emoji: null },
          { text: "Encouragement", emoji: null },
        ].map((val) => {
          val.prompt_id = 2;
          return val;
        }),
      },
    ];

    const dates = {
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Add created at and updated at to all prompts and prompt options
    insertData = insertData.map((data) => {
      //? Add dates to all prompts
      data.prompt = { ...data.prompt, ...dates };

      //? Add dates to all prompt options
      data.options = data.options.map((option) => {
        return { ...option, ...dates };
      });

      return data;
    });

    // Getting prompts & prompt options again here to allow us to use the nested structure above without having to worry about how they are inserted into the db when adding new records
    //* You don't need to change anything below this to add new records
    const promptsToInsert = insertData.map((data) => data.prompt);
    const promptOptionsToInsert = insertData.map((data) => data.options).flat();

    await queryInterface.bulkInsert("prompts", promptsToInsert);
    await queryInterface.bulkInsert("prompt_options", promptOptionsToInsert);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("prompts", null, {});
  },
};
