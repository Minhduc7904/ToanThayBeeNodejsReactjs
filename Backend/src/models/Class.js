'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Class.hasMany(models.StudentClassStatus, {
        foreignKey: 'classId',
        as: 'classStatuses',
      })
      Class.hasMany(models.Lesson, {
        foreignKey: 'classId', 
        as: 'lessons',        
      })
      
    }
  }
  Class.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    academicYear: DataTypes.STRING,
    status: DataTypes.STRING,
    slideId: DataTypes.INTEGER,
    lessonCount: DataTypes.INTEGER,
    dayOfWeek: DataTypes.STRING,
    studyTime: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'class'
  })
  return Class
}