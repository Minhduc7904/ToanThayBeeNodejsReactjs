'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ClassLessons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClassLessons.init({
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'ClassLessons',
    tableName: 'classLessons'
  })
  return ClassLessons
}