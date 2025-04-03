'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class LessonAssistants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LessonAssistants.init({
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
  },
    assistantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
  },

  }, {
    sequelize,
    modelName: 'LessonAssistants',
    tableName: 'lessonAssistants'
  })
  return LessonAssistants
}