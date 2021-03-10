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
    return queryInterface.bulkInsert('system_settings', [{
      name: 'from_email',
      value: 'joynconnect@gmail.com',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'from_name',
      value: 'Joyn',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'noreply_email',
      value: 'noreply@joyn.com',
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
    return queryInterface.bulkDelete('Users', null, {});
  }
};
