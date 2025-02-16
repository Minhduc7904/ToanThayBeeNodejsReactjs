'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentExamAttempt  extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentExamAttempt.init({
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    score: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'StudentExamAttempt',
    tableName: 'studentExamAttempt'
  });
  return StudentExamAttempt;
};