import db from '../models/index.js';
import UserType from '../constants/UserType.js';
import { uploadImage, cleanupUploadedFiles } from "../utils/imageUpload.js"
import { Op, or } from "sequelize";
import { uploadPdfToFirebase, deletePdfFromFirebase } from "../utils/pdfUpload.js"

export const getArticle = async (req, res) => {
    const article = await db.Article.findAll({
        order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
    });

    res.status(200).json({
        message: 'Danh sách bài viết',
        data: article
    })
}

export const getNewestArticle = async (req, res) => {
    const article = await db.Article.findAll({
        order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
        limit: 3
    });
    res.status(200).json({
        message: 'Danh sách bài viết mới nhất',
        data: article
    })
}

export const getArticleById = async (req, res) => {
    const { id } = req.params

    const article = await db.Article.findOne({
        where: {
            id: id
        }
    })

    if (!article) {
        return res.status(404).json({
            message: 'Không tìm thấy bài viết'
        })
    }

    res.status(200).json({
        message: 'Chi tiết bài viết',
        data: article
    })
}

export const putArticle = async (req, res) => {
    await db.Article.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({
        message: 'Cập nhật bài viết thành công'
    })
}

export const postArticle = async (req, res) => {
    await db.Article.create(req.body)
    res.status(201).json({
        message: 'Tạo bài viết thành công'
    })
}

export const deleteArticle = async (req, res) => {
    await db.Article.destroy({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({
        message: 'Xóa bài viết thành công',
        data: req.params.id
    })
}
