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
               WHERE Dept_Code LIKE ?
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

router.post('/add_dean', async(req,res) =>{                   //use to add new dept to database
    const { Doc_Code , Dept_Code, Experience_year} = req.body;
    console.log(req.body);
    const insertQuery = ` INSERT INTO dean (Doc_Code , Dept_Code, Experience_year) VALUES (?, ?,?);`;
    db.query(insertQuery, [Doc_Code , Dept_Code, Experience_year], (err, results) => {
        if (err) {
            res.status(500).json({error: err}); 
            return;
        } 
        res.status(201).json(results);
    });
});

router.put('/update', (req, res) => {
    const {Dept_Code, Title, oldDept_Code} = req.body;
    const updateQuery = 'UPDATE department SET Dept_Code=?, Title = ? WHERE Dept_Code = ? ';
    
    db.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        } else {
            db.query(updateQuery, [Dept_Code, Title, oldDept_Code], (err, result) => {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }else{
                db.query( 'UPDATE dean SET Dept_Code = ? WHERE Dept_Code = ?', [Dept_Code, oldDept_Code] , (err, result) =>{
                    if (err){
                        res.status(500).json({ error: err });
                        return;
                    } else {
                        //
                        db.query('SET FOREIGN_KEY_CHECKS = 0', (err) =>{
                            if (err){
                                res.status(500).json({ error: err });
                                return;
                            }
                        })
                        res.status(201).json(result);
                    }
                })
            }
        })}
    });
});

router.get('/get_deans', (req, res) => {                                     //for get dean list 
  const sql = `SELECT * FROM dean 
               ORDER BY Dept_Code`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.put('/update_dean', (req, res) => {                               //update dean of a department
    const {Doc_Code, Experience_year, oldDept_Code} = req.body;
    const updateQuery = 'UPDATE dean SET Doc_Code = ?, Experience_year = ? WHERE Dept_Code = ? ';
    db.query(updateQuery, [Doc_Code, Experience_year, oldDept_Code], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        } else {
            res.status(201).json(result);
        }
    });
});



export default router;