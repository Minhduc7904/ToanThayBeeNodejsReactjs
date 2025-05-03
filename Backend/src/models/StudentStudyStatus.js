'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class StudentStudyStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentStudyStatus.belongsTo(models.User, {
        foreignKey: 'studentId',
        as: 'student'
      });

      // Một learning item có thể có nhiều trạng thái học tập từ các học sinh
      StudentStudyStatus.belongsTo(models.LearningItem, {
        foreignKey: 'learningItemId',
        as: 'learningItem'
      });
    }
  }
  StudentStudyStatus.init({
    learningItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    isDone: DataTypes.BOOLEAN,
    studyTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'StudentStudyStatus',
    tableName: 'studentStudyStatus'
  })
  return StudentStudyStatus
}