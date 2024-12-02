import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
dotenv.config({ path: '../../Login_secret_key.env' });

const router = express.Router();

router.get('/get-departments', (req, res) => {                                         //for getting all the departments on start up
    const sql = 'SELECT * FROM department ORDER BY Dept_Code';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

router.get('/search', (req, res) => {                                     //for searching 
  const search = `%${req.query.search}%`
  const sql = `SELECT * FROM department 
               WHERE Dept_Code LIKE ? OR Title LIKE ? 
               ORDER BY Dept_Code`;
  db.query(sql, [search, search], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.post('/add-to-db', async(req,res) =>{                   //use to add new dept to database
    const { Dept_Code, Title} = req.body;
    console.log(req.body);
    const insertQuery = ` INSERT INTO department (Dept_Code, Title) VALUES (?, ?);`;
    db.query(insertQuery, [Dept_Code, Title], (err, results) => {
        if (err) {
            res.status(500).json({error: err}); 
            return;
        } 
        res.status(201).json(results);
    });
});



export default router;