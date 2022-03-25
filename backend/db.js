var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10000,
  host: "etsy.c5bcnawebmvb.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "apup%123",
  port: 3306,
  database: "etsy",
});

pool.getConnection(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = pool;
