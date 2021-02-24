'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HealthCategoryUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HealthCategoryUser.init({
    user_id: DataTypes.INTEGER,
    health_category_id: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'HealthCategoryUser',
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return HealthCategoryUser;
};