const Sequelize = require('sequelize');
let sequelize;

try {
  sequelize = new Sequelize(
    process.env.SQL_DB_NAME,
    process.env.SQL_DB_USER,
    process.env.SQL_DB_PASSWORD,
    {
      dialect: "mysql",
      host: process.env.SQL_DB_HOST,
      define: {
        timestamps: false,
      },
    }
  );
  console.log("Database connected succesfylly.");
}
catch (err) {
  console.log("Error in connecting Database", (err));
}



module.exports = sequelize;