"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("allCode", [
      // 👤 User Type
      { code: "AD", type: "user type", description: "Admin", createdAt: new Date(), updatedAt: new Date() },
      { code: "HS1", type: "user type", description: "Học sinh trên lớp", createdAt: new Date(), updatedAt: new Date() },
      { code: "GV", type: "user type", description: "Giáo viên", createdAt: new Date(), updatedAt: new Date() },
      { code: "AS", type: "user type", description: "Trợ giảng", createdAt: new Date(), updatedAt: new Date() },

      // Grade
      { code: "10", type: "grade", description: "Lớp 10", createdAt: new Date(), updatedAt: new Date() },
      { code: "11", type: "grade", description: "Lớp 11", createdAt: new Date(), updatedAt: new Date() },
      { code: "12", type: "grade", description: "Lớp 12", createdAt: new Date(), updatedAt: new Date() },
      

      // 📚 Class Status
      { code: "LHD", type: "class status", description: "Hoạt động", createdAt: new Date(), updatedAt: new Date() },
      { code: "LKT", type: "class status", description: "Kết thúc", createdAt: new Date(), updatedAt: new Date() },

      // 🎓 Student Status
      { code: "HSDH", type: "student status", description: "Học sinh đang học", createdAt: new Date(), updatedAt: new Date() },
      { code: "HSNH", type: "student status", description: "Học sinh nghỉ học", createdAt: new Date(), updatedAt: new Date() },
      { code: "HSTN", type: "student status", description: "Học sinh tốt nghiệp", createdAt: new Date(), updatedAt: new Date() },

      // 🗓️ Days of Week (DOW)
      { code: "T2", type: "dow", description: "Thứ 2", createdAt: new Date(), updatedAt: new Date() },
      { code: "T3", type: "dow", description: "Thứ 3", createdAt: new Date(), updatedAt: new Date() },
      { code: "T4", type: "dow", description: "Thứ 4", createdAt: new Date(), updatedAt: new Date() },
      { code: "T5", type: "dow", description: "Thứ 5", createdAt: new Date(), updatedAt: new Date() },
      { code: "T6", type: "dow", description: "Thứ 6", createdAt: new Date(), updatedAt: new Date() },
      { code: "T7", type: "dow", description: "Thứ 7", createdAt: new Date(), updatedAt: new Date() },
      { code: "CN", type: "dow", description: "Chủ nhật", createdAt: new Date(), updatedAt: new Date() },

      // ⏳ Duration
      { code: "7:00 - 9:00", type: "duration", description: "Từ 7h sáng đến 9h sáng", createdAt: new Date(), updatedAt: new Date() },
      { code: "8:00 - 10:00", type: "duration", description: "Từ 8h sáng đến 10h sáng", createdAt: new Date(), updatedAt: new Date() },
      { code: "9:00 - 11:00", type: "duration", description: "Từ 9h sáng đến 11h sáng", createdAt: new Date(), updatedAt: new Date() },

      // 📖 Study Item Type
      { code: "BTVN", type: "study item type", description: "Bài tập về nhà", createdAt: new Date(), updatedAt: new Date() },
      { code: "DOC", type: "study item type", description: "Tài liệu", createdAt: new Date(), updatedAt: new Date() },
      { code: "VID", type: "study item type", description: "Video", createdAt: new Date(), updatedAt: new Date() },
      { code: "IMA", type: "study item type", description: "Image", createdAt: new Date(), updatedAt: new Date() },

      // 📝 Exam Type
      { code: "GK1", type: "exam type", description: "Giữa kì 1", createdAt: new Date(), updatedAt: new Date() },
      { code: "CK1", type: "exam type", description: "Cuối kì 1", createdAt: new Date(), updatedAt: new Date() },
      { code: "GK2", type: "exam type", description: "Giữa kì 2", createdAt: new Date(), updatedAt: new Date() },
      { code: "CK2", type: "exam type", description: "Cuối kì 2", createdAt: new Date(), updatedAt: new Date() },
      { code: "OT", type: "exam type", description: "Ôn tập", createdAt: new Date(), updatedAt: new Date() },
      { code: "THPT", type: "exam type", description: "Thi THPT", createdAt: new Date(), updatedAt: new Date() },
      { code: "OTTHPT", type: "exam type", description: "Ôn thi THPT", createdAt: new Date(), updatedAt: new Date() },
      { code: "HSA", type: "exam type", description: "Đánh giá năng lực", createdAt: new Date(), updatedAt: new Date() },
      { code: "TSA", type: "exam type", description: "Đánh giá tư duy", createdAt: new Date(), updatedAt: new Date() },

      // 📚 Chapter
      { code: "10C1", type: "chapter", description: "Lớp 10 Chương 1", createdAt: new Date(), updatedAt: new Date() },
      { code: "11C1", type: "chapter", description: "Lớp 11 Chương 1", createdAt: new Date(), updatedAt: new Date() },
      { code: "12C1", type: "chapter", description: "Lớp 12 Chương 1", createdAt: new Date(), updatedAt: new Date() },

      // ❓ Question Type
      { code: "TN", type: "question type", description: "Trắc nghiệm", createdAt: new Date(), updatedAt: new Date() },
      { code: "TLN", type: "question type", description: "Trả lời ngắn", createdAt: new Date(), updatedAt: new Date() },
      { code: "DS", type: "question type", description: "Đúng/Sai", createdAt: new Date(), updatedAt: new Date() },

      // 🎯 Difficulty
      { code: "NB", type: "difficulty", description: "Nhận biết", createdAt: new Date(), updatedAt: new Date() },
      { code: "TH", type: "difficulty", description: "Thông hiểu", createdAt: new Date(), updatedAt: new Date() },
      { code: "VD", type: "difficulty", description: "Vận dụng", createdAt: new Date(), updatedAt: new Date() },
      { code: "VDC", type: "difficulty", description: "Vận dụng cao", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("allCode", null, {});
  },
};
