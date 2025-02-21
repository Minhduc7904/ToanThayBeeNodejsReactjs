'use strict';
const {
  Model
} = require('sequelize');
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
        as: 'student', // 🔑 Trùng với as trong include
      });
      StudentClassStatus.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class', // 🔑 Trùng với as trong include
      });
      StudentClassStatus.belongsTo(models.Class, { foreignKey: 'classId' });
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
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StudentClassStatus',
    tableName: 'studentClassStatus',
    timestamps: false
  });
  return StudentClassStatus;
};