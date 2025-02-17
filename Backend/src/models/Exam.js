'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Exam',
    tableName: 'exam'
  });
  return Exam;
};