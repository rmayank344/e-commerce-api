const { DataTypes } = require('sequelize');
const sequelize = require("../config/sql_conn");

const USERMODEL = sequelize.define('user_model',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // This will add automatically created_at and updated_at
    freezeTableName: true,
    tableName: "user_model",
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = USERMODEL