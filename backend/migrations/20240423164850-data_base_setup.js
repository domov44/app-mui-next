'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Création de la table `role`
    await queryInterface.createTable('role', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING(35)
      }
    });

    // Création de la table `user`
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      creation_date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      ddn: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING(255)
      },
      pseudo: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(25)
      },
      surname: {
        allowNull: false,
        type: Sequelize.STRING(25)
      },
      picture: {
        allowNull: false,
        type: Sequelize.STRING(255),
        defaultValue: 'https://www.club.reltim.com/wp-content/uploads/2023/01/engineer-1.png'
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'role',
          key: 'id'
        }
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(150)
      },
      resetPasswordToken: {
        type: Sequelize.TEXT
      },
      resetPasswordExpires: {
        type: Sequelize.DATE
      }
    });

    // Création de la table `permission`
    await queryInterface.createTable('permission', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
