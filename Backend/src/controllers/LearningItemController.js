import db from "../models/index.js"
import { uploadPdfToFirebase, deletePdfFromFirebase } from "../utils/pdfUpload.js"

export const getLearningItemById = async (req, res) => {
    const { id } = req.params
    const learningItem = await db.LearningItem.findOne({ where: { id } })
    if (!learningItem) {
        return res.status(404).json({
            message: `Không tìm thấy mục học tập với ID: ${id}!`
        })
    }
    return res.status(200).json({
        message: 'Lấy thông tin mục học tập thành công!',
        data: learningItem
    })
}

export const getLearningItemByLesson = async (req, res) => {
    const { lessonId } = req.params
    const find = await db.Lesson.findByPk(lessonId)
    if (!find) {
        return res.status(404).json({
            message: `Không tìm thấy buổi học với ID: ${lessonId}!`
        })
    }
    const learningItems = await db.LearningItem.findAll({
        where: { lessonId },
        include: [
            {
                model: db.Lesson,
                as: 'lesson',
                attributes: ['id', 'name', 'description']
            }
        ],
        order: [['createdAt', 'ASC']]
    })

    return res.status(200).json({
        message: 'Lấy danh sách mục học tập thành công!',
        data: learningItems
    })

}

export const getUncompletedLearningItem = async (req, res) => {
    const { id } = req.user

    const uncompletedItems = await db.StudentStudyStatus.findAll({
        where: { studentId: id, isDone: false },
        include: [
            {
                model: db.LearningItem,
                as: 'learningItem',
                include: [
                    {
                        model: db.Lesson,
                        as: 'lesson',
                        attributes: ['id'],
                        include: [
                            {
                                model: db.Class,
                                as: 'class',
                                attributes: ['name', 'class_code']
                            }
                        ]
                        
                    },
                ],
            },
        ],
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
        message: 'Lấy danh sách mục học tập chưa hoàn thành thành công!',
        data: uncompletedItems
    })
}

export const postLearningItem = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const newLearningItem = await db.LearningItem.create(req.body, { transaction: t });

        const lessonUpdated = await db.Lesson.increment(
            { learningItemCount: 1 },
            {
                where: { id: newLearningItem.lessonId },
                transaction: t,
            }
        );

        if (!lessonUpdated[0]) {
            throw new Error("Không tìm thấy buổi học để cập nhật learningItemCount.");
        }

        // 🔍 Bước 1: Tìm classId từ lessonId
        const lesson = await db.Lesson.findByPk(newLearningItem.lessonId, {
            attributes: ['classId'],
            transaction: t,
        });

        // 🔍 Bước 2: Tìm tất cả học sinh đã JOINED lớp
        const students = await db.StudentClassStatus.findAll({
            where: {
                classId: lesson.classId,
                status: 'JS',
            },
            attributes: ['studentId'],
            transaction: t,
        });

        const studentStudyStatuses = students.map((s) => ({
            studentId: s.studentId,
            learningItemId: newLearningItem.id,
            isDone: false,
            studyTime: null,
        }));

        // Bước 3: Tạo tất cả bản ghi trạng thái học tập
        if (studentStudyStatuses.length > 0) {
            await db.StudentStudyStatus.bulkCreate(studentStudyStatuses, {
                transaction: t,
                ignoreDuplicates: true, // đề phòng trường hợp thêm lại
            });
        }

        await t.commit();

        return res.status(201).json({
            message: "Thêm mục học tập mới thành công và cập nhật trạng thái học tập!",
            data: newLearningItem,
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            message: "Lỗi khi thêm mục học tập hoặc cập nhật trạng thái học.",
            error: error.message,
        });
    }
};

export const uploadLearningItemPdf = async (req, res) => {
    const { id } = req.params;

    const learningItem = await db.LearningItem.findOne({ where: { id } });
    if (!learningItem) {
        return res.status(404).json({
            message: `Không tìm thấy mục học tập với ID: ${id}!`
        });
    }

    // Khởi tạo transaction
    const transaction = await db.sequelize.transaction();
    let uploadedFile;
    try {
        // Nếu đã có URL PDF cũ thì xóa trước
        if (learningItem.url) {
            await deletePdfFromFirebase(learningItem.url);
        }

        if (req.file) {
            // Upload PDF mới
            uploadedFile = await uploadPdfToFirebase(req);

            // Cập nhật URL trong database
            await learningItem.update({ url: uploadedFile.file }, { transaction });
        } else {
            // Nếu không có file mới, xóa URL cũ
            await learningItem.update({ url: null }, { transaction });
        }

        // Commit transaction
        await transaction.commit();

        return res.status(200).json({
            message: uploadedFile ? "Upload file PDF thành công!" : "Xóa file PDF thành công!",
            data: learningItem
        });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await transaction.rollback();

        // Nếu đã upload file, xóa lại file đã upload
        if (uploadedFile) {
            await deletePdfFromFirebase(uploadedFile.file);
        }

        return res.status(500).json({
            message: "Lỗi khi upload file PDF.",
            error: error.message
        });
    }
};



export const putLearningItem = async (req, res) => {
    const { id } = req.params
    const learningItem = await db.LearningItem.findOne({ where: { id } })
    if (!learningItem) {
        return res.status(404).json({
            message: `Không tìm thấy mục học tập với ID: ${id}!`
        })
    }

    await learningItem.update(req.body)
    return res.status(200).json({
        message: "Cập nhật thông tin mục học tập thành công!",
        data: learningItem
    })
}

export const deleteLearningItem = async (req, res) => {
    const { id } = req.params
    const t = await db.sequelize.transaction()

    try {
        const learningItem = await db.LearningItem.findOne({ where: { id } })
        if (!learningItem) {
            return res.status(404).json({
                message: `Không tìm thấy mục học tập với ID: ${id}!`
            })
        }

        // if (learningItem.typeOfLearningItem === "DOC") {
        //     // Nếu là tài liệu, xóa file PDF trên Firebase Storage
        //     await deletePdfFromFirebase(learningItem.url)
        // }


        await learningItem.destroy({ transaction: t })

        await db.Lesson.decrement(
            { learningItemCount: 1 },
            {
                where: { id: learningItem.lessonId },
                transaction: t
            }
        )

        await t.commit()

        return res.status(200).json({
            message: "Xóa mục học tập thành công và cập nhật learningItemCount!"
        })
    } catch (error) {
        await t.rollback()
        return res.status(500).json({
            message: "Lỗi khi xóa mục học tập hoặc cập nhật learningItemCount.",
            error: error.message
        })
    }
}

export const markLearningItem = async (req, res) => {
    const { learningItemId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
        return res.status(401).json({
            message: 'Người dùng chưa xác thực!',
        });
    }

    const status = await db.StudentStudyStatus.findOne({
        where: {
            learningItemId,
            studentId,
        },
    });

    if (!status) {
        return res.status(404).json({
            message: 'Không tìm thấy trạng thái học cho mục học tập này!',
        });
    }

    await status.update({
        isDone: !status.isDone,
        studyTime: new Date(),
    });

    return res.status(200).json({
        message: 'Đánh dấu mục học tập thành công!',
        data: status,
    });
};
