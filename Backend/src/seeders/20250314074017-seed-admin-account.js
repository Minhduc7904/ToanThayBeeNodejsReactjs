"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ✅ Mã hóa mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash("070904", 10);

    return queryInterface.bulkInsert("user", [
      {
        lastName: "Nguyễn Minh",
        firstName: "Đức",
        username: "minhduc7904",
        email: "nmduc7904@gmail.com",
        password: hashedPassword, // ✅ Mật khẩu đã được mã hóa
        userType: "AD", // 🔹 Đảm bảo "AD" có trong bảng allCode
        gender: true, // 🔹 BOOLEAN (true = 1, false = 0)
        phone: "0392923661",
        class: "12", // 🔹 Đảm bảo "12" có trong bảng allCode
        status: "HSTN", // 🔹 Đảm bảo "HSTN" có trong bảng allCode
        highSchool: "THPT Thăng Long",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", { username: "minhduc7904" });
  },
};
