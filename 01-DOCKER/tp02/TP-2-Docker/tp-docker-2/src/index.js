'use strict';

const express = require('express');
var mysql = require('mysql');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
  var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST || '0.0.0.0' ,
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  })

  connection.connect(function (error) {
    if (error) {
      console.log("Connection to MySQL failed.");
      throw error
    }
  });

  const query = 'SELECT SUM(1+1) as sum'
  connection.query(query, function (error, result) {
    if (error) throw error;
    res.send(`'${query}' => ${result[0].sum}`);
  });

  connection.end
});

app.listen(PORT, HOST);
console.log(`Running on port ${PORT}`);