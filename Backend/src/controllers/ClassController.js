import db from "../models/index.js"
import ResponseClass from "../dtos/responses/class/ClassResponse.js"
const { Class } = db
import StudentClassStatus from "../constants/StudentClassStatus.js"
import { Op } from "sequelize"
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"
const { sequelize } = db;


export const getPublicClass = async (req, res) => {
    const classes = await Class.findAll({
        where: {
            status: 'LHD',
            public: true,
        },
        order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
        message: 'Lấy danh sách lớp thành công!',
        data: classes,
        totalItems: classes.length,
    })
}

export const getAllClass = async (req, res) => {
    const search = req.query.search || ''
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const offset = (page - 1) * limit
    const sortOrder = req.query.sortOrder || 'DESC'

    const whereClause = {
        ...(search.trim() && {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
            ],
        }),
    }

    const { rows: classes, count: total } = await Class.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', sortOrder]],
    })

    return res.status(200).json({
        message: 'Lấy danh sách lớp thành công!',
        data: classes,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    })
}

export const getDetailClassByAdmin = async (req, res) => {
    const id = req.params.id;

    try {
        const classItem = await db.Class.findOne({
            where: { id },
            include: [
                {
                    model: db.Slide,
                    as: 'slide',
                    include: [
                        {
                            model: db.SlideImage,
                            as: 'slideImages',
                        }
                    ]
                }
            ]
        });

        if (!classItem) {
            return res.status(404).json({
                message: `Không tìm thấy lớp với ID: ${id}!`
            });
        }

        return res.status(200).json({
            message: 'Lấy thông tin lớp thành công!',
            data: classItem
        });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết lớp:", error);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};


export const getDetailClassByUser = async (req, res) => {
    const userId = req.user.id;
    const { classCode } = req.params;

    try {
        const classItem = await db.Class.findOne({
            where: { class_code: classCode },
            include: [
                {
                    model: db.Slide,
                    as: 'slide',
                    include: [
                        {
                            model: db.SlideImage,
                            as: 'slideImages',
                        }
                    ]
                }
            ]
        });

        if (!classItem) {
            return res.status(404).json({
                message: `Không tìm thấy lớp với mã: ${classCode}!`
            });
        }

        const statusData = await db.StudentClassStatus.findOne({
            where: { studentId: userId, classId: classItem.id }
        });

        const status = statusData?.status || db.StudentClassStatus.NOT_JOINED;

        return res.status(200).json({
            message: 'Lấy thông tin lớp thành công!',
            data: classItem,
            studentClassStatus: status
        });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết lớp:", error);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

export const getClassByUser = async (req, res) => {
    const userId = req.user.id;
    // Lấy tất cả lớp người dùng đã tham gia
    const classes = await db.StudentClassStatus.findAll({
        where: { studentId: userId },
        include: [
            {
                model: db.Class,
                as: 'class',
            },
        ],
    });

    // Format lại danh sách + tính sĩ số từng lớp
    const formattedClasses = await Promise.all(
        classes.map(async (classRecord) => {
            const lop = classRecord.class;
            const status = classRecord.status;

            const studentCount = await db.StudentClassStatus.count({
                where: {
                    classId: lop.id,
                    status: 'JS',
                },
            });

            return {
                ...new ResponseClass(lop, status),
                studentCount,
            };
        })
    );

    return res.status(200).json({
        message: 'Lấy danh sách lớp theo người dùng thành công!',
        data: formattedClasses,
        totalItems: formattedClasses.length,
    });
};

export const getOverviewClass = async (req, res) => {
    const { id } = req.user

    const classes = await db.StudentClassStatus.findAll({
        where: { studentId: id, status: 'JS' },
        include: [
            {
                model: db.Class,
                as: 'class',
            },
        ],
    });

    res.status(200).json({
        message: "Lấy lớp học hôm nay thành công",
        data: classes,
    });
}

export const getDetailLessonLearningItemByClassId = async (req, res) => {
    const { classCode } = req.params;
    const userId = req.user?.id; // 👈 user hiện tại từ middleware xác thực

    const foundClass = await db.Class.findOne({
        where: { class_code: classCode, public: true },
        include: [
            {
                model: db.Lesson,
                as: 'lessons',
                attributes: ['name', 'description', 'id', 'day'], // Chỉ lấy name & description của Lesson
                include: [
                    {
                        model: db.LearningItem,
                        as: 'learningItems',
                        attributes: ['name', 'id', 'typeOfLearningItem'] // Chỉ lấy name & description của LearningItem
                    }
                ],
                order: [
                    ['day', 'ASC']
                ]
            },
            {
                model: db.Slide,
                as: 'slide',
                include: [
                    {
                        model: db.SlideImage,
                        as: 'slideImages'
                    }
                ]
            }
        ]
    });

    if (!foundClass) {
        return res.status(404).json({
            message: 'Không tìm thấy lớp học với classId đã cung cấp!',
            data: null,
        });
    }

    foundClass.lessons = foundClass.lessons.sort((a, b) => {
        // So sánh ngày theo thứ tự giảm dần (DESC)
        return new Date(a.day) - new Date(b.day);
    });

    // Đếm số học sinh đã vào lớp (status === 'JS')
    const studentCount = await db.StudentClassStatus.count({
        where: {
            classId: foundClass.id,
            status: 'JS'
        }
    });

    // Lấy trạng thái của người dùng hiện tại trong lớp
    let userStatus = null;
    if (userId) {
        const studentClass = await db.StudentClassStatus.findOne({
            where: {
                classId: foundClass.id,
                studentId: userId
            }
        });
        userStatus = studentClass?.status || null;
    }

    return res.status(200).json({
        message: 'Lấy thông tin lớp, bài học, mục học tập và trạng thái người dùng thành công!',
        data: {
            ...foundClass.toJSON(),
            joinedStudentCount: studentCount,
            userStatus
        },
    });
};

export const getFullLessonLearningItemByClassCode = async (req, res) => {
    const { classCode } = req.params;
    const userId = req.user?.id; // 👈 user hiện tại từ middleware xác thực

    try {
        const foundClass = await db.Class.findOne({
            where: { class_code: classCode },
            include: [
                {
                    model: db.Lesson,
                    as: 'lessons',
                    include: [
                        {
                            model: db.LearningItem,
                            as: 'learningItems',
                            include: [
                                {
                                    model: db.StudentStudyStatus,
                                    as: 'studyStatuses',
                                    where: { studentId: userId },
                                    attributes: ['isDone', 'studyTime'],
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ]
        });


        if (!foundClass) {
            return res.status(404).json({
                message: 'Không tìm thấy lớp học với classCode đã cung cấp!',
                data: null,
            });
        }

        // Lấy trạng thái của người dùng trong lớp học
        let userStatus = null;
        if (userId) {
            const studentClass = await db.StudentClassStatus.findOne({
                where: {
                    classId: foundClass.id,
                    studentId: userId
                }
            });
            userStatus = studentClass?.status || null;
        }

        if (userStatus !== 'JS') {
            return res.status(403).json({
                message: 'Bạn không thể xem nội dung này vì chưa tham gia lớp học!',
                data: null,
            });
        }

        foundClass.lessons = foundClass.lessons.sort((a, b) => {
            return new Date(a.day) - new Date(b.day);
        });

        return res.status(200).json({
            message: 'Lấy thông tin lớp, bài học, mục học tập và trạng thái người dùng thành công!',
            data: {
                ...foundClass.toJSON(),
                userStatus
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi khi lấy thông tin lớp học.',
            error: error.message,
        });
    }
};


export const getFullLessonByClassID = async (req, res) => {
    const { id } = req.params;

    const foundClass = await db.Class.findOne({
        where: { id: id },
        include: [
            {
                model: db.Lesson,
                as: 'lessons',
                include: [
                    {
                        model: db.LearningItem,
                        as: 'learningItems',
                    }
                ]
            }
        ]
    });

    if (!foundClass) {
        return res.status(404).json({
            message: 'Không tìm thấy lớp học với classId đã cung cấp!',
            data: null,
        });
    }

    return res.status(200).json({
        message: 'Lấy thông tin lớp, bài học, mục học tập và trạng thái người dùng thành công!',
        data: {
            ...foundClass.toJSON(),
        },
    });
};

export const postClass = async (req, res) => {
    try {
        // Bước 1: Tạo mã lớp trước (chưa có ID nên tạm random)
        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase(); // VD: "KX1P2"

        // Tạo bản ghi tạm với class_code rỗng hoặc code tạm
        const newClass = await Class.create({ ...req.body, class_code: "TEMP" });

        // Bước 2: Gán lại mã lớp có thêm ID để đảm bảo duy nhất
        const classCode = `${randomCode}${newClass.id}`;

        // Bước 3: Cập nhật lại
        newClass.class_code = classCode;
        await newClass.save();

        return res.status(201).json({
            message: 'Tạo lớp học thành công',
            newClass,
        });
    } catch (error) {
        console.error("Tạo lớp thất bại:", error);
        return res.status(500).json({ message: 'Lỗi tạo lớp học', error: error.message });
    }
};


export const putClass = async (req, res) => {
    const { id } = req.params

    const forbiddenFields = ['id', 'createdAt', 'updatedAt']

    const updatedData = Object.keys(req.body)
        .filter(key => !forbiddenFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key]
            return obj
        }, {})

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'Không có trường hợp lệ để cập nhật.' })
    }

    const [updated] = await Class.update(updatedData, { where: { id } })

    if (!updated) {
        return res.status(404).json({ message: 'Lớp học không tồn tại' })
    }

    const updatedClass = await Class.findByPk(id)

    return res.status(200).json({ message: 'Cập nhật lớp học thành công', data: new ResponseClass(updatedClass) })
}

export const deleteClass = async (req, res) => {
    const { id } = req.params

    // 0. Tìm lớp học
    const classItem = await Class.findByPk(id)
    if (!classItem) {
        return res.status(404).json({ message: 'Lớp học không tồn tại' })
    }

    // 1. Tìm Slide gắn với Class (dựa vào classItem.slideId)
    const slide = await db.Slide.findOne({ where: { id: classItem.slideId } })

    if (slide) {
        // 2. Tìm tất cả ảnh trong SlideImage
        const slideImages = await db.SlideImage.findAll({ where: { slideId: slide.id } })
        const imageUrls = slideImages.map(img => img.imageUrl)

        // 3. Xóa ảnh trên Firebase
        if (imageUrls.length > 0) {
            await cleanupUploadedFiles(imageUrls)
        }

        // 4. Xóa dữ liệu SlideImage
        await db.SlideImage.destroy({ where: { slideId: slide.id } })

        // 5. Xóa Slide
        await db.Slide.destroy({ where: { id: slide.id } })
    }

    // 6. Xóa Class
    await Class.destroy({ where: { id } })

    return res.status(200).json({ message: 'Xóa lớp học thành công' })

}

export const putSlideImagesForClass = async (req, res) => {
    const transaction = await sequelize.transaction();
    const { id: classId } = req.params;
    const slideId = req.body.slideId || null;
    const files = req.files?.images || [];
    const keepImageIds = req.body.keepImageIds ? JSON.parse(req.body.keepImageIds) : [];

    // Mảng lưu ảnh đã upload thành công
    const uploadedUrls = [];

    try {
        const classItem = await db.Class.findByPk(classId, { transaction });
        if (!classItem) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Lớp không tồn tại.' });
        }

        let slide;

        if (slideId) {
            slide = await db.Slide.findByPk(slideId, {
                include: [{ model: db.SlideImage, as: 'slideImages' }],
                transaction,
            });

            if (!slide) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Slide không tồn tại.' });
            }

            const oldImages = slide.slideImages || [];
            const imagesToDelete = oldImages.filter(img => !keepImageIds.includes(img.id));
            const urlsToDelete = imagesToDelete.map(img => img.url);

            if (imagesToDelete.length > 0) {
                await db.SlideImage.destroy({
                    where: { id: imagesToDelete.map(img => img.id) },
                    transaction,
                });
                await cleanupUploadedFiles(urlsToDelete);
            }

            for (const file of files) {
                const imageUrl = await uploadImage(file);
                uploadedUrls.push(imageUrl); // Ghi lại ảnh đã upload
                await db.SlideImage.create({ slideId, imageUrl }, { transaction });
            }
        } else {
            slide = await db.Slide.create({}, { transaction });

            for (const file of files) {
                const imageUrl = await uploadImage(file);
                console.log('imageUrl', imageUrl);
                uploadedUrls.push(imageUrl);
                const slideImage = await db.SlideImage.create({ slideId: slide.id, imageUrl: imageUrl }, { transaction });
                console.log('slideImage', slideImage);

            }

            classItem.slideId = slide.id;
            await classItem.save({ transaction });
        }

        await transaction.commit();
        return res.status(200).json({ message: 'Cập nhật slide thành công.' });
    } catch (error) {
        console.error("Lỗi khi cập nhật slide:", error);

        // Xóa ảnh đã upload thành công
        if (uploadedUrls.length > 0) {
            await cleanupUploadedFiles(uploadedUrls);
        }

        await transaction.rollback();
        return res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};




export const joinClass = async (req, res) => {
    const userId = req.user.id;
    const { classCode } = req.params; // 👈 lấy mã lớp từ URL

    // Mở transaction
    const transaction = await db.sequelize.transaction();

    try {
        // 1. Tìm lớp theo mã lớp
        const classInfo = await db.Class.findOne({
            where: { class_code: classCode },
            transaction
        });

        // Không tìm thấy hoặc lớp không công khai
        if (!classInfo || !classInfo.public) {
            await transaction.rollback();
            return res.status(400).json({ message: "Không thể tham gia lớp học này!" });
        }

        // 2. Thêm học sinh vào bảng StudentClassStatus
        const insert = await db.StudentClassStatus.create({
            studentId: userId,
            classId: classInfo.id,
            status: "WS" // hoặc StudentClassStatus.WAITED nếu bạn đã định nghĩa
        }, { transaction });

        if (!insert) {
            await transaction.rollback();
            return res.status(500).json({ message: "Tham gia lớp học không thành công!" });
        }

        // 3. Cập nhật sĩ số
        await db.Class.update(
            { studentCount: db.sequelize.literal('studentCount + 1') },
            { where: { id: classInfo.id }, transaction }
        );

        // 4. Commit transaction
        await transaction.commit();

        return res.status(200).json({ message: "Tham gia lớp học thành công!" });

    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi tham gia lớp học:", error);
        return res.status(500).json({ message: "Lỗi server khi tham gia lớp học!" });
    }
};


export const acceptStudentJoinClass = async (req, res) => {
    const { studentId, classId } = req.params;

    const transaction = await db.sequelize.transaction();

    try {
        const update = await db.StudentClassStatus.update(
            { status: StudentClassStatus.JOINED },
            {
                where: { studentId, classId },
                transaction,
            }
        );

        if (!update[0]) {
            await transaction.rollback();
            return res.status(500).json({ message: 'Chấp nhận học viên tham gia lớp học không thành công!' });
        }

        const lessons = await db.Lesson.findAll({
            where: { classId },
            include: [{
                model: db.LearningItem,
                as: 'learningItems',
                attributes: ['id'],
            }],
            transaction,
        });

        const learningItemIds = lessons.flatMap(lesson =>
            lesson.learningItems?.map(item => item.id) || []
        );

        if (learningItemIds.length > 0) {
            const studentStudyStatuses = learningItemIds.map(learningItemId => ({
                studentId,
                learningItemId,
                isDone: false,
                studyTime: null,
            }));

            await db.StudentStudyStatus.bulkCreate(studentStudyStatuses, { transaction });
        }

        await transaction.commit();
        return res.status(200).json({ message: 'Chấp nhận học viên tham gia lớp học thành công!' });

    } catch (error) {
        console.error('Error accepting student into class:', error);
        await transaction.rollback();
        return res.status(500).json({ message: 'Có lỗi xảy ra khi chấp nhận học viên tham gia lớp học.' });
    }
};

export const kickStudentFromClass = async (req, res) => {
    const { studentId, classId } = req.params
    const deleteRecord = await db.StudentClassStatus.destroy({
        where: {
            studentId,
            classId
        }
    })
    if (deleteRecord) {
        return res.status(200).json({ message: 'Xóa học viên khỏi lớp học thành công!' })
    }
    return res.status(500).json({ message: 'Xóa học viên khỏi lớp học không thành công!' })
}