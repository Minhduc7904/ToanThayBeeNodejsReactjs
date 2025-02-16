'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssistantReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AssistantReport.init({
    userId: DataTypes.INTEGER,
    assistantId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    star: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'AssistantReport',
    tableName: 'assistantReport'
  });
  return AssistantReport;
};