'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('personality_questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      options: {
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('personality_questions');
  }
};
