'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('admin_permissions', [{
      admin_user_id: '1',
      permissions: '{"race/list": true, "race/store": true,"race/edit/*": true,"race/delete/*": true, "gender/list": true, "gender/store": true,"gender/edit/*": true, "gender/delete/*": true, "sexual_orientation/list": true, "sexual_orientation/store": true, "sexual_orientation/edit/*": true, "sexual_orientation/delete/*": true, "workout/list": true, "workout/store": true, "workout/edit/*": true, "workout/delete/*": true, "health_category/list": true, "health_category/store": true, "health_category/edit/*": true, "health_category/delete/*": true }',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
