'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class StudentClassStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentClassStatus.belongsTo(models.User, {
        foreignKey: 'studentId',
        as: 'student',
      })
      StudentClassStatus.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class', 
      })
      StudentClassStatus.belongsTo(models.Class, { foreignKey: 'classId' })
    }

  }
  StudentClassStatus.init({
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'StudentClassStatus',
    tableName: 'studentClassStatus',
    timestamps: false
  })
  return StudentClassStatus
}