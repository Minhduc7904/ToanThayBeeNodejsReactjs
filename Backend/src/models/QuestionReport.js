'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuestionReport.init({
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'QuestionReport',
    tableName: 'questionReport'
  });
  return QuestionReport;
};