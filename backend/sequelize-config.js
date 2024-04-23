// // sequelize-config.js AVEC DOCKER
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('app_recettes', 'root', 'root_password', {
//   host: 'db',
//   dialect: 'mysql',
//   define: {
//     freezeTableName: true,
//     timestamps: false,
//   },
// });

// module.exports = sequelize;


// sequelize-config.js AVEC WAMP
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('app_mui_next', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

module.exports = sequelize;

// // sequelize-config.js avec XAMPP
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('app_recettes', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   define: {
//     freezeTableName: true,
//     timestamps: false,
//   },
// });

// module.exports = sequelize