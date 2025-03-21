'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsToMany(models.Exam, {
        through: 'ExamQuestions',       
        foreignKey: 'questionId',        
        otherKey: 'examId',             
        as: 'exams',                      
      })
      Question.hasMany(models.Statement, { foreignKey: 'questionId', as: 'statements' })
    }
  }
  Question.init({
    class: DataTypes.STRING,
    content: DataTypes.TEXT,
    typeOfQuestion: DataTypes.STRING,
    correctAnswer: DataTypes.STRING,
    solution: DataTypes.TEXT,
    difficulty: DataTypes.STRING,
    chapter: DataTypes.STRING,
    description: DataTypes.TEXT,
    solutionUrl: DataTypes.TEXT,
    imageUrl: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    solutionImageUrl: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'question'
  })
  return Question
}
