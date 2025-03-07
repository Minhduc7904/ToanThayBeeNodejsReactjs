'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Statement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Statement.belongsTo(models.Question, { foreignKey: 'questionId', as: 'question' })
      
      Statement.belongsTo(models.AllCode, { foreignKey: 'difficulty', as: 'difficultyCode' })
    }
  }
  Statement.init({
    content: DataTypes.TEXT,
    questionId: DataTypes.INTEGER,
    imageUrl: DataTypes.TEXT,
    isCorrect: DataTypes.BOOLEAN,
    difficulty: DataTypes.STRING,
    order: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Statement',
    tableName: 'statement'
  })
  return Statement
}
