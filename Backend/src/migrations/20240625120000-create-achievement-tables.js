'use strict'
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Create achievement_categories table
    await queryInterface.createTable('achievement_categories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      display_order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create achievement_stats table
    await queryInterface.createTable('achievement_stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        allowNull: false,
        type: Sequelize.STRING(50),
        references: {
          model: 'achievement_categories',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      display_order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create achievement_images table
    await queryInterface.createTable('achievement_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        allowNull: false,
        type: Sequelize.STRING(50),
        references: {
          model: 'achievement_categories',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      image_url: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      caption: {
        type: Sequelize.STRING(200)
      },
      display_order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('achievement_images');
    await queryInterface.dropTable('achievement_stats');
    await queryInterface.dropTable('achievement_categories');
  }
}
