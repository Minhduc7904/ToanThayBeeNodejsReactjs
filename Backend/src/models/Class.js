'use strict'
import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
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
      Class.belongsTo(models.Slide, {
        foreignKey: 'slideId',
        as: 'slide'
      });
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
    studentCount: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    class_code: DataTypes.STRING(20)
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'class'
  })
  return Class
}