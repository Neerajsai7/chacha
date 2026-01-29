const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcd1234",
  database: "EDU_DB"
});

db.connect(err => {
  if (err) {
    console.error("MySQL Error:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.post("/login", (req, res) => {
  const { role, id, password } = req.body;

  if (!role || !id || !password) {
    return res.json({ success: false });
  }

  let table = "";
  let idField = "id";

  if (role === "teachers") {
    table = "teachers";
  } 
  else if (role === "students") {
    table = "students";
  } 
  else if (role === "parents") {
    table = "parents";
    idField = "student_id";
  } 
  else {
    return res.json({ success: false });
  }

  const query = `SELECT * FROM ${table} WHERE ${idField}=? AND password=?`;

  db.query(query, [id, password], (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});