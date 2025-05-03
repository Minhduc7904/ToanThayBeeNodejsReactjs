'use strict'
import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class AchievementImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations
      AchievementImage.belongsTo(models.AchievementCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }
  
  AchievementImage.init({
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
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    caption: {
      type: DataTypes.STRING(200)
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AchievementImage',
    tableName: 'achievement_images'
  })
  
  return AchievementImage
}
