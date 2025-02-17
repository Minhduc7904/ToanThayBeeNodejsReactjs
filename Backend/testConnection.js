require("dotenv").config(); // 👈 Đặt ngay dòng đầu tiên

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_DEV_DATABASE,
    process.env.DB_DEV_USERNAME,
    process.env.DB_DEV_PASSWORD,
    {
        host: process.env.DB_DEV_HOST,
        port: process.env.DB_DEV_PORT,
        dialect: "mysql",
        logging: console.log
    }
);

async function testDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Kết nối database thành công!");
    } catch (error) {
        console.error("❌ Không thể kết nối đến database:", error);
        console.log(process.env.DB_DEV_DATABASE, process.env.DB_DEV_USERNAME, process.env.DB_DEV_PASSWORD, process.env.DB_DEV_HOST, process.env.DB_DEV_PORT);
    }
}

testDB();
