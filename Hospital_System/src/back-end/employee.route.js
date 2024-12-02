import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
dotenv.config({ path: 'D:/HK241/Hospital/Coding/Hospital_System/Login_secret_key.env' });
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

    // Kiểm tra dữ liệu đầu vào
    if (!updatedEmployee || !updatedEmployee.id) {
        return res.status(400).send('Invalid employee data');
    }

    // Bắt đầu giao dịch
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction initiation error:', err);
            return res.status(500).send('Failed to initiate transaction');
        }

        // Câu lệnh SQL
        const query = `
             UPDATE EMPLOYEE 
        SET 
          F_name = ?, 
          L_name = ?, 
          Phone_number = ?, 
          Gender = ?, 
          Dob = ?, 
          Address = ?, 
          \`Start date\` = ?, 
          Dept_Code = ?, 
          \`Specialty Name\` = ?, 
          \`Degree's year\` = ? 
        WHERE 
          Emp_Code = ?;
        `;

        // Giá trị truyền vào SQL
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
            updatedEmployee.id // Khóa chính
        ];

        // Thực thi câu lệnh SQL
        db.query(query, values, (err, result) => {
            if (err) {
                // Rollback nếu có lỗi
                return db.rollback(() => {
                    console.error('SQL Execution Error:', err);
                    res.status(500).send('Failed to update employee, all changes reverted');
                });
            }

            // Commit giao dịch
            db.commit((commitErr) => {
                if (commitErr) {
                    return db.rollback(() => {
                        console.error('Commit Error:', commitErr);
                        res.status(500).send('Failed to commit transaction');
                    });
                }
                res.send('Employee updated successfully');
            });
        });
    });
});

  
  
  

  export default router;