const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234', 
    database: 'web_shoes'
});

module.exports = pool.promise();
