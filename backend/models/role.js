const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize-config');

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  label: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
}, {
  tableName: 'role',
  timestamps: false,
});

module.exports = Role;