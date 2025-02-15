'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menh_De extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mỗi mệnh đề thuộc về một câu hỏi (Cau_hoi)
      Menh_De.belongsTo(models.Cau_hoi, { foreignKey: 'ma_cau_hoi', as: 'cauHoi' });
      
      // Nếu cần, định nghĩa association với All_code cho trường do_kho
      Menh_De.belongsTo(models.All_code, { foreignKey: 'do_kho', as: 'dokho' });
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
    tableName: 'Menh_De'
  });
  return Menh_De;
};
