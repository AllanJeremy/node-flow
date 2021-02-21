'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CompanyUser.init({
    company_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CompanyUser',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return CompanyUser;
  
};