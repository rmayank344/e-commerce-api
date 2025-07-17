const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require("./config/sql_conn");


app.use(express.json());

app.use(cors({
  origin: "*", // You can replace * with your frontend domain for security
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    // "Content-Type",
    // "Authorization",
    "x-api-key",
    "x-auth-token",
  ]
}));

//auth routes
app.use('/api/admin/v1/auth-service', require("./routes/admin_routes"));
app.use('/api/user/v1/auth-service', require("./routes/user_routes"));

//product routes
app.use('/api/admin/v1/product-service', require("./routes/admin_routes"));
app.use('/api/user/v1/product-service', require("./routes/user_routes"));


app.listen(process.env.PORT, '0.0.0.0', ()=> {
  console.log(`Server is running on port ${process.env.PORT}`);
});