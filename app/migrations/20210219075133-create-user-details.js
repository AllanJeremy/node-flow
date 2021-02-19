'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      race_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Races',
          key: 'id'
        }
      },
      gender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Genders',
          key: 'id'
        }
      },
      sexual_orientation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SexualOrientations',
          key: 'id'
        }
      },
      family_detail_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FamilyDynamics',
          key: 'id'
        }
      },
      mental_health_section_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MentalHealthSections',
          key: 'id'
        }
      },
      conversation_starter_id: {
        type: Sequelize.JSON,
        references: {
          model: 'ConversationStarters',
          key: 'id'
        }
      },
      short_story: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_details');
  }
};