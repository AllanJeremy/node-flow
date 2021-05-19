'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('user_metadata', 'race_status', Sequelize.STRING, {
        after: 'sexual_orientation_status'
     });
     return queryInterface.sequelize.query("ALTER TABLE user_metadata ADD COLUMN race_status INTEGER(11) AFTER sexual_orientation_status;")
     await queryInterface.addColumn('user_metadata', 'family_dynamic_status', Sequelize.STRING, {
      after: 'race_status'
     });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('user_metadata');
  }
};
