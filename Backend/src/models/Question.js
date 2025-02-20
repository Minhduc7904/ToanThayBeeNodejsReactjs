'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsToMany(models.Exam, {
        through: 'ExamQuestions',       // Bảng trung gian
        foreignKey: 'questionId',         // Khóa ngoại trong bảng trung gian
        otherKey: 'examId',               // Khóa liên kết đến bảng Exam
        as: 'exams',                      // Tên alias khi include
      });
      Question.hasMany(models.Statement, { foreignKey: 'questionId', as: 'statements' });
    }
  }
  Question.init({
    class: DataTypes.STRING,
    content: DataTypes.TEXT,
    typeOfQuestion: DataTypes.STRING,
    correctAnswer: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    chapter: DataTypes.STRING,
    description: DataTypes.TEXT,
    solutionUrl: DataTypes.TEXT,
    imageUrl: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'question'
  });
  return Question;
};
