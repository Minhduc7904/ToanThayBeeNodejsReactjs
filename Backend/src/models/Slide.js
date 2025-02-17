'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Slide.hasMany(models.SlideImage, { foreignKey: "slideId", onDelete: "CASCADE" });
    }
  }
  Slide.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Slide',
    tableName: 'slides'
  });
  return Slide;
};