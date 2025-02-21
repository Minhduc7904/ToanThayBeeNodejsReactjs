'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lesson.belongsTo(models.Class, {
        foreignKey: 'classId', // 🔑 Liên kết với cột classId trong Lesson
        as: 'class',           // 👉 Alias khi cần include ngược lại
      });
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
  });
  return Lesson;
};