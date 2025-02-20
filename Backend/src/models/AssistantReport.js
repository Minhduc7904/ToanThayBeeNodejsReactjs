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
      AssistantReport.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      AssistantReport.belongsTo(models.User, { foreignKey: 'assistantId', as: 'assistant' })
    }
  }
  AssistantReport.init({
    userId: DataTypes.INTEGER,
    assistantId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    star: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
  }, {
    sequelize,
    modelName: 'AssistantReport',
    tableName: 'assistantReport',
    timestamps: false,
  });
  return AssistantReport;
};