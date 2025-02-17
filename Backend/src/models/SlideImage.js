'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SlideImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SlideImage.belongsTo(models.Slide, { foreignKey: "slideId" });
    }
  }
  SlideImage.init({
    slideId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SlideImage',
    tableName: 'slideImages',
  });
  return SlideImage;
};