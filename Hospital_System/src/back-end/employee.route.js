import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
dotenv.config({ path: 'D:/HK241/Hospital/Coding/Hospital_System/Login_secret_key.env' });

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
  
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).send('Failed to initiate transaction');
      }
  
      // Prepare the SQL query and values for updating an employee
      const query = `
        UPDATE EMPLOYEE 
        SET 
          F_name = ?, 
          L_name = ?, 
          Phone_number = ?, 
          Gender = ?, 
          Dob = ?, 
          Address = ?, 
          Start_date = ?, 
          Dept_Code = ?, 
          Specialty_Name = ?, 
          Degree_year = ? 
        WHERE 
          Emp_Code = ?;
      `;
  
      const values = [
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
        // Thêm trường Position
        updatedEmployee.id,       // Employee code (primary key)
      ];
  
      // Execute the query within the transaction
      db.query(query, values, (err, result) => {
        if (err) {
          // Rollback if any error occurs
          db.rollback(() => {
            console.error(err);
            res.status(500).send('Failed to update employee, all changes reverted');
          });
        } else {
          // Commit the transaction if successful
          db.commit((commitErr) => {
            if (commitErr) {
              db.rollback(() => {
                res.status(500).send('Failed to commit transaction');
              });
            } else {
              res.send('Employee updated successfully');
            }
          });
        }
      });
    });
  });
  
  
  

  export default router;