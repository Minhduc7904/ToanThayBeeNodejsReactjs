'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Article extends Model {
        static associate(models) {
            // Liên kết với bảng AllCode cho các thuộc tính mã hóa
            Article.belongsTo(models.AllCode, {
                foreignKey: 'type',
                targetKey: 'code',
                as: 'typeData'
            });

            Article.belongsTo(models.AllCode, {
                foreignKey: 'class',
                targetKey: 'code',
                as: 'classData'
            });

            Article.belongsTo(models.AllCode, {
                foreignKey: 'chapter',
                targetKey: 'code',
                as: 'chapterData'
            });
        }
    }

    Article.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class: {
            type: DataTypes.STRING,
            allowNull: true
        },
        chapter: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Article',
        tableName: 'article',
    });

    return Article;
};
