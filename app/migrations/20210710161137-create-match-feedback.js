'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('match_feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      ratings: {
        type: Sequelize.INTEGER
      },
      answer: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        field: "created_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('match_feedbacks');
  }
};
