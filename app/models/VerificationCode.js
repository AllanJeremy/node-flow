'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VerificationCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  VerificationCode.init({
    user_id: DataTypes.INTEGER,
    verification_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VerificationCode',
    tableName: 'verification_codes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  });
  return VerificationCode;
};
