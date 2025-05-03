'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.StudentClassStatus, {
        foreignKey: 'studentId',
        as: 'classStatuses',
      })
      User.hasMany(models.StudentStudyStatus, {
        foreignKey: 'studentId',
        as: 'studyStatuses'
      });
      User.hasMany(models.AssistantReport, { foreignKey: 'userId', as: 'reports' })
      User.hasMany(models.AssistantReport, { foreignKey: 'assistantId', as: 'assistantReports' })
      User.hasMany(models.StudentExamAttempt, { foreignKey: 'studentId' });
      User.hasMany(models.StudentExamStatus, { foreignKey: 'studentId' });
    }
  }
  User.init({
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    userType: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    birthDate: DataTypes.DATE,
    phone: DataTypes.STRING,
    highSchool: DataTypes.STRING,
    class: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    graduationYear: DataTypes.INTEGER,
    highSchoolScore: DataTypes.FLOAT,
    university: DataTypes.STRING,
    avatarUrl: DataTypes.TEXT,
    currentToken: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  })
  return User
}
