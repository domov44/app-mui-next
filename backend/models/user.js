const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize-config');

const Role = require('./role');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  ddn: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pseudo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'https://www.club.reltim.com/wp-content/uploads/2023/01/engineer-1.png'
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    get() {
        const expirationDate = this.getDataValue('resetPasswordExpires');
        if (!expirationDate) return null;
        return expirationDate.toISOString().slice(0, 19).replace('T', ' ');
    },
    set(value) {
        this.setDataValue('resetPasswordExpires', value);
    }
}

}, {
  tableName: 'user',
  timestamps: false // Si vous souhaitez utiliser les timestamps générés automatiquement par Sequelize
});

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;
