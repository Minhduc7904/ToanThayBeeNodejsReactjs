'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LearningItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LearningItem.init({
    name: DataTypes.STRING,
    lessonId: DataTypes.INTEGER,
    typeOfLearningItem: DataTypes.STRING,
    url: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'LearningItem',
    tableName: 'learningItem'
  });
  return LearningItem;
};