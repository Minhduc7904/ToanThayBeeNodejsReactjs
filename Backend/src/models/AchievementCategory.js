'use strict'
import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class AchievementCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations
      AchievementCategory.hasMany(models.AchievementStat, {
        foreignKey: 'category_id',
        as: 'stats'
      });
      
      AchievementCategory.hasMany(models.AchievementImage, {
        foreignKey: 'category_id',
        as: 'images'
      });
    }
  }
  
  AchievementCategory.init({
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: 'AchievementCategory',
    tableName: 'achievement_categories'
  })
  
  return AchievementCategory
}
