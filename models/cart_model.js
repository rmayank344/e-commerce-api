const { DataTypes } = require('sequelize');
const sequelize = require('../config/sql_conn');

const Cart_Model = sequelize.define('cart_model', {
  cart_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_model', // Table name of the referenced table
      key: 'user_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product_model', // Table name of the referenced table
      key: 'product_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'cart_model',
  freezeTableName: true,
  timestamps: true,
});

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = Cart_Model;