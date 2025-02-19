'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class studentExamStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  studentExamStatus.init({
    studentId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    isDone: DataTypes.BOOLEAN,
    isSave: DataTypes.BOOLEAN,
    completionTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'studentExamStatus',
    tableName: 'studentExamStatus',
  });
  return studentExamStatus;
};