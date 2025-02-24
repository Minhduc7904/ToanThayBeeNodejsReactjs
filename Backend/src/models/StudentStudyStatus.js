'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class StudentStudyStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
    studyTime : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'StudentStudyStatus',
    tableName: 'studentStudyStatus'
  })
  return StudentStudyStatus
}