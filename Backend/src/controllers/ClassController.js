import { Sequelize } from "../models";
import db from "../models";
import ResponseClass from "../dtos/responses/class/ClassResponse";
const { Class } = db;
import StudentClassStatus from "../constants/StudentClassStatus";

// LopController.js
// Lấy danh sách tất cả các lớp học
// GET http://localhost:3000/api/v1/Class?search=...
export const getPublicClass = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // 📄 Thiết lập điều kiện tìm kiếm
    const whereClause = {
        public: true, // Thêm điều kiện public = true
        ...(search.trim() && {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
            ],
        }),
    };

    // 📥 Truy vấn lớp
    const { rows: classes, count: total } = await Class.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
        message: '✅ Lấy danh sách lớp thành công!',
        data: classes,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    });
};

export const getAllClass = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // 📄 Thiết lập điều kiện tìm kiếm
    const whereClause = {
        ...(search.trim() && {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
            ],
        }),
    };

    // 📥 Truy vấn lớp
    const { rows: classes, count: total } = await Class.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
        message: '✅ Lấy danh sách lớp thành công!',
        data: classes,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    });
};

// Lấy chi tiết một lớp học theo id
// GET http://localhost:3000/api/lop/:id
export const getDetailClassByAdmin = async (req, res) => {
    const id = req.params.id;

    // Truy vấn lớp theo id
    const classItem = await db.Class.findOne({ where: { id } });

    if (!classItem) {
        return res.status(404).json({
            message: `Không tìm thấy lớp với ID: ${id}!`
        });
    }

    return res.status(200).json({
        message: '✅ Lấy thông tin lớp thành công!',
        data: classItem,
    });
};

export const getDetailClassByUser = async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;

    // Truy vấn lớp theo id
    const classItem = await db.Class.findOne({ where: { id } });

    if (!classItem) {
        return res.status(404).json({
            message: `Không tìm thấy lớp với ID: ${id}!`
        });
    }

    const { status } = await db.StudentClassStatus.findOne({
        where: { studentId: userId, classId: id }
    })

    if (!status) {
        status = StudentClassStatus.NOT_JOINED
    }



    return res.status(200).json({
        message: '✅ Lấy thông tin lớp thành công!',
        data: classItem,
        studentClassStatus: status
    });
};

// Lấy ra danh sách lớp học đã tham gia hoặc đang chờ
export const getClassByUser = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Lấy userId từ thông tin user được xác thực (ví dụ từ token)
    const userId = req.user.id;

    // Xây dựng điều kiện tìm kiếm cho bảng Class
    const whereClause = search.trim() ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
        ],
    } : {};

    // Truy vấn các lớp mà user đã tham gia thông qua bảng User (với alias 'users')
    const classes = await db.StudentClassStatus.findAll({
        where: { studentId: userId },
        include: [
            {
                model: db.Class,
                as: 'class',
                where: whereClause,
            },
        ],
        limit,
        offset,
    });

    const formattedClasses = classes.map(classRecord => {
        const lop = classRecord.class; // Lấy từ alias 'student'
        const status = classRecord.status; // Lấy status từ StudentClassStatus
        return new ResponseClass(lop, status); // Truyền vào UserResponse
    });
    const total = formattedClasses.length

    return res.status(200).json({
        message: '✅ Lấy danh sách lớp theo người dùng thành công!',
        data: formattedClasses,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    });
}

// Thêm một lớp học mới
// POST http://localhost:3000/api/v1/class
export const postClass = async (req, res) => {
    const newClass = await Class.create(req.body);
    return res.status(201).json({
        message: 'Tạo lớp học thành công',
        newClass
    });
};

// Cập nhật thông tin một lớp học
// PUT http://localhost:3000/api/lop/:id
export const putClass = async (req, res) => {
    // Lấy id của lớp học từ params
    const { id } = req.params;

    // Định nghĩa các trường không cho phép cập nhật, ví dụ như các trường hệ thống
    const forbiddenFields = ['id', 'createdAt', 'updatedAt'];

    // Lọc các trường hợp lệ từ req.body, loại bỏ những trường bị cấm
    const updatedData = Object.keys(req.body)
        .filter(key => !forbiddenFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {});

    // Nếu không có dữ liệu hợp lệ nào để cập nhật, trả về lỗi 400
    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'Không có trường hợp lệ để cập nhật.' });
    }

    // Cập nhật dữ liệu lớp học dựa vào id
    const [updated] = await Class.update(updatedData, { where: { id } });

    // Nếu không có bản ghi nào được cập nhật, có nghĩa là lớp học không tồn tại, trả về lỗi 404
    if (!updated) {
        return res.status(404).json({ message: 'Lớp học không tồn tại' });
    }

    // Lấy lại thông tin lớp học sau khi cập nhật
    const updatedClass = await Class.findByPk(id);

    // Trả về phản hồi thành công cùng với dữ liệu lớp học đã được định dạng
    return res.status(200).json({ message: 'Cập nhật lớp học thành công', data: new ResponseClass(updatedClass) });
};

// Xóa một lớp học theo id
// DELETE http://localhost:3000/api/lop/:id
export const deleteClass = async (req, res) => {
    // Lấy id của lớp học từ tham số URL
    const { id } = req.params;

    // Thực hiện xóa lớp học dựa theo id
    const deleted = await Class.destroy({ where: { id } });

    // Nếu không có bản ghi nào bị xóa, trả về lỗi 404
    if (!deleted) {
        return res.status(404).json({ message: 'Lớp học không tồn tại' });
    }

    // Nếu xóa thành công, trả về thông báo thành công
    return res.status(200).json({ message: 'Xóa lớp học thành công' });
};

export const joinClass = async (req, res) => {
    const userId = req.user.id
    const { classId } = req.params

    const { public: isPublic } = await db.Class.findOne({ where: { id: classId } })
    if (!isPublic) {
        return res.status(400).json({ message: 'Không thể tham gia lớp học này!' });
    }

    const insert = await db.StudentClassStatus.create({
        studentId: userId,
        classId,
        status: StudentClassStatus.WAITED
    })

    if (insert) {
        return res.status(200).json({ message: 'Tham gia lớp học thành công!' });
    }
    return res.status(500).json({ message: 'Tham gia lớp học không thành công!' });
}

export const acceptStudentJoinClass = async (req, res) => {
    const { studentId, classId } = req.params

    const update = await db.StudentClassStatus.update({
        status: StudentClassStatus.JOINED
    }, {
        where: {
            studentId,
            classId
        }
    })

    if (update) {
        return res.status(200).json({ message: 'Chấp nhận học viên tham gia lớp học thành công!' });
    }
    return res.status(500).json({ message: 'Chấp nhận học viên tham gia lớp học không thành công!' });
}

export const kickStudentFromClass = async (req, res) => {
    const { studentId, classId } = req.params
    const deleteRecord = await db.StudentClassStatus.destroy({
        where: {
            studentId,
            classId
        }
    })
    if (deleteRecord) {
        return res.status(200).json({ message: 'Xóa học viên khỏi lớp học thành công!' });
    }
    return res.status(500).json({ message: 'Xóa học viên khỏi lớp học không thành công!' });
}