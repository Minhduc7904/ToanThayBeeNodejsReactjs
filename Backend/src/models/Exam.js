'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Exam.belongsToMany(models.Question, {
        through: 'ExamQuestions',       
        foreignKey: 'examId',             
        otherKey: 'questionId',           
        as: 'questions',                  
      })
      Exam.associate = (models) => {
        Exam.hasMany(models.StudentExamAttempt, {
          foreignKey: "examId",
          as: "attempts"
        });
      };
      
    }
  }
  Exam.init({
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    typeOfExam: DataTypes.STRING,
    chapter: DataTypes.STRING,
    year: DataTypes.STRING,
    testDuration: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    passRate: DataTypes.INTEGER,
    solutionUrl: DataTypes.TEXT,
    imageUrl: DataTypes.TEXT,
    public: DataTypes.BOOLEAN,
    attemptLimit: DataTypes.INTEGER,
    isCheatingCheckEnabled: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Exam',
    tableName: 'exam'
  })
  return Exam
}