'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Class.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    academicYear: DataTypes.STRING,
    status: DataTypes.STRING,
    imageUrl: DataTypes.TEXT,
    lessonCount: DataTypes.INTEGER,
    dayOfWeek: DataTypes.STRING,
    studyTime: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'class'
  });
  return Class;
};