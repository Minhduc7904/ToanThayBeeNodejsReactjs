'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

// 👉 Khi dùng biến môi trường
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // 👉 Khi dùng cấu hình trực tiếp (pool sẽ được tự động sử dụng từ config)
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config, // Gồm cả phần pool
    logging: false, // Tắt log (tùy chọn)
  });
}

// 👉 Tự động load các model
fs
  .readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 👉 Liên kết các model nếu có
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 👉 Xuất Sequelize + kết nối
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
