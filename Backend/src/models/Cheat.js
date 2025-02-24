'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Cheat extends Model {
    static associate(models) {
      // define association here
    }
  }

  Cheat.init({
    typeOfCheat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attemptId: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
  }, {
    sequelize,
    modelName: 'Cheat',
    tableName: 'cheat',
    timestamps: false, 
  })

  return Cheat
}
