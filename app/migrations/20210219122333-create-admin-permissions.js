'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      admin_user_id: {
        type: Sequelize.INTEGER
      },
      permissions: {
        type: Sequelize.JSON
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
    },{
        underscored: true
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_permissions');
  }
};
