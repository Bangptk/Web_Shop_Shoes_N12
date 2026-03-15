// server.js (Ví dụ đơn giản)
const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'shoe_store'
});

app.get('/api/products', (req, res) => {
  const sql = `
    SELECT p.*, b.name as brand_name 
    FROM products p 
    JOIN brands b ON p.brand_id = b.id`;
    
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));