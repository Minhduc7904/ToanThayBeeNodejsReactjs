'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamQuestions  extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExamQuestions.init({
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'ExamQuestions',
    tableName: 'examQuestions'
  });
  return ExamQuestions;
};