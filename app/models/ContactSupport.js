"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContactSupport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContactSupport.init(
    {
      user_id: DataTypes.INTEGER,
      email: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ContactSupport",
      tableName: "contact_support",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ContactSupport;
};
