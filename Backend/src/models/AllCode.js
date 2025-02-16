'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AllCode.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true 
    },
    type: DataTypes.STRING,         
    description: DataTypes.TEXT,      
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AllCode',
    tableName: 'allCode'
  });
  return AllCode;
};
