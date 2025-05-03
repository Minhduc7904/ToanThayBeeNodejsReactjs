'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class StudentExamAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentExamAttempt.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
      StudentExamAttempt.belongsTo(models.Exam, { foreignKey: "examId", as: "exam" });
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
    tableName: 'studentExamAttempt',
    timestamps: false,
  })
  return StudentExamAttempt
}