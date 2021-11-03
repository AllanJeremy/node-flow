"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const defaultAchievements = [
      {
        //
        name: "Starting out",
        description: "Matched first peer",
        image_url: null,
        trigger_table: "listed_peers",
        trigger_event: "create",
        user_id_column: "user_id",
        action_type: "count_records",
        action_operator: "greater_than_or_equal_to",
        action_comparison_value: "1",
      },
      {
        //
        name: "Making connections",
        description: "Matched 5 peers",
        image_url: null,
        trigger_table: "listed_peers",
        trigger_event: "create",
        user_id_column: "user_id",
        action_type: "count_records",
        action_operator: "greater_than_or_equal_to",
        action_comparison_value: "5",
      },
      {
        //
        name: "Networker",
        description: "Matched 20 peers",
        image_url: null,
        trigger_table: "listed_peers",
        trigger_event: "create",
        user_id_column: "user_id",
        action_type: "count_records",
        action_operator: "greater_than_or_equal_to",
        action_comparison_value: "20",
      },
    ].map((achievement) => {
      // Add default created at and updated at dates
      return { ...achievement, created_at: new Date(), updated_at: new Date() };
    });

    await queryInterface.bulkInsert("achievements", defaultAchievements);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("achievements", null, {});
  },
};
