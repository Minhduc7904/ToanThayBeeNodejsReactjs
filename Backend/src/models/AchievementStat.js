'use strict'
import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class AchievementStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations
      AchievementStat.belongsTo(models.AchievementCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }
  
  AchievementStat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    category_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AchievementStat',
    tableName: 'achievement_stats'
  })
  
  return AchievementStat
}
