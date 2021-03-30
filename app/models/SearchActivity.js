'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SearchActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SearchActivity.init({
    action: DataTypes.STRING,
    metadata: DataTypes.JSON,
    attempted_at: DataTypes.DATE,
    reason: DataTypes.JSON,
    attempted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SearchActivity',
    tableName: 'search_activities',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return SearchActivity;
};