'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class StudentExamStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentExamStatus.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
      StudentExamStatus.belongsTo(models.Exam, { foreignKey: 'examId', as: 'exam' });
    }
  }
  StudentExamStatus.init({
    studentId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    isDone: DataTypes.BOOLEAN,
    isSave: DataTypes.BOOLEAN,
    completionTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'StudentExamStatus',
    tableName: 'studentExamStatus',
    timestamps: false 
  })
  return StudentExamStatus
}