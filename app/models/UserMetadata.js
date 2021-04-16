'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMetadata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserMetadata.init({
    user_id: DataTypes.INTEGER,
    race_id: DataTypes.INTEGER,
    race_status: DataTypes.INTEGER,
    gender_id: DataTypes.INTEGER,
    gender_status: DataTypes.INTEGER,
    sexual_orientation_id: DataTypes.INTEGER,
    sexual_orientation_status: DataTypes.INTEGER,
    family_detail_id: DataTypes.INTEGER,
    family_detail_status: DataTypes.INTEGER,
    summary: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserMetadata',
    tableName: 'user_metadata',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  });
  return UserMetadata;
};