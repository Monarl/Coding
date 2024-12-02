import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
dotenv.config({ path: '../../Login_secret_key.env' });

const router = express.Router();

const adjustDate = (dateString) => {
  if (!dateString) return null; // Return null if date string is empty
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1); // Add 1 day
  return date.toISOString().split("T")[0]; // Return formatted date
};

router.get('/employee-list', (req, res) => {
    const sql = 'SELECT * FROM EMPLOYEE ORDER BY Emp_Code';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

  router.get('/employee-search', (req, res) => {
    const search = `%${req.query.search}%`
    const sql = `SELECT * FROM EMPLOYEE e 
                 WHERE F_name LIKE ? OR L_name LIKE ? OR e.Emp_Code LIKE ? 
                 ORDER BY Emp_Code`;
    db.query(sql, [search, search, search], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

  export default router;