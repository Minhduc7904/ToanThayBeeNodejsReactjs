'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lesson.belongsTo(models.Class, {
        foreignKey: 'classId', 
        as: 'class',          
      })
      Lesson.hasMany(models.LearningItem, {
        foreignKey: 'lessonId', 
        as: 'learningItems',        
      })
    }
  }
  Lesson.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    learningItemCount: DataTypes.INTEGER,
    day: DataTypes.DATE,
    classId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'lesson'
  })
  return Lesson
}