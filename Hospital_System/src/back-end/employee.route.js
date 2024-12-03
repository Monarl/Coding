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

  router.post('/dean-employee-list', (req, res) => {
    const { empCode, search } = req.body;
    const searchTerm = `%${search || ''}%`; // Allow search to be optional

    const query = `
        SELECT e.*
        FROM EMPLOYEE e
        WHERE e.Dept_Code = (
            SELECT Dept_Code
            FROM EMPLOYEE
            WHERE Emp_Code = ?
        )
        AND e.Emp_Code != ?
        AND (e.F_name LIKE ? OR e.L_name LIKE ? OR e.Emp_Code LIKE ?)
        ORDER BY e.Emp_Code;
    `;

    db.query(query, [empCode, empCode, searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json(results);
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

  router.get('/employee-detail', (req, res) => {
    const search = `%${req.query.search}%`; // Lấy giá trị tìm kiếm
    const sql = (req.query.search.substring(0, 1) === 'D') 
      ? `SELECT * FROM EMPLOYEE WHERE Emp_Code LIKE ? ORDER BY Emp_Code`
      : `SELECT * FROM EMPLOYEE WHERE Emp_Code LIKE ? ORDER BY Emp_Code`;
  
    db.query(sql, [search], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

  router.get('/department-list', (req, res) => {
    const sql = 'SELECT * FROM DEPARTMENT ORDER BY Dept_Code';
    
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

  router.put('/employee-update', (req, res) => {
    const updatedEmployee = req.body.employeeData;

    // Kiểm tra dữ liệu đầu vào
    if (!updatedEmployee || !updatedEmployee.id) {
        return res.status(400).send('Invalid employee data');
    }

    // Chuẩn bị giá trị truyền vào
    const values = [
        updatedEmployee.id, // Emp_Code
        updatedEmployee.F_name,
        updatedEmployee.L_name,
        updatedEmployee.Phone_num,
        updatedEmployee.Gender,
        adjustDate(updatedEmployee.Dob),
        updatedEmployee.Address,
        adjustDate(updatedEmployee.Start_date),
        updatedEmployee.Dept_Code,
        updatedEmployee.Specialty_Name,
        updatedEmployee.Degree_year,
        updatedEmployee.Working
    ];

    // Gọi procedure
    const query = 'CALL UpsertEmployee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Procedure Execution Error:', err);
            return res.status(500).send('Failed to update or insert employee');
        }
        res.send('Employee upserted successfully');
    });
});

  export default router;