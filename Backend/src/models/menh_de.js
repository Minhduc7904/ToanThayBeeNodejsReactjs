'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menh_De extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Menh_De.init({
    noi_dung: DataTypes.TEXT,
    ma_cau_hoi: DataTypes.INTEGER,
    link_anhMH: DataTypes.TEXT,
    is_correct: DataTypes.BOOLEAN,
    do_kho: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Menh_De',
  });
  return Menh_De;
};