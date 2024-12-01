import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
dotenv.config({ path: 'D:/HK241/Hospital/Coding/Hospital_System/Login_secret_key.env' });

const router = express.Router();

router.get('/getMed', (req, res) => {                                         //for getting all the medications on start up
    const sql = 'SELECT * FROM medication ORDER BY Med_Code';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

router.get('/med-search', (req, res) => {                                     //for searching medication
  const search = `%${req.query.search}%`
  const sql = `SELECT * FROM medication 
               WHERE Med_Name LIKE ? OR Med_Code LIKE ? 
               ORDER BY Med_Code`;
  db.query(sql, [search, search], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.post('/add-to-db', async(req,res) =>{                   //use to add new med to database
    const { Med_Name, Price, Expiration_date, Effects } = req.body;
    console.log(req.body);
    const insertQuery = ` INSERT INTO medication (Med_Name, Price, Expiration_date, Effects) VALUES (?, ?, ?, ?);`;
    db.query(insertQuery, [Med_Name, Price, Expiration_date, Effects], (err, results) => {
        if (err) {
            res.status(500).json({error: err}); 
            return;
        } 
        res.status(201).json(results);
    });
});

router.put('/update', (req, res) => {
    const { Med_Name, Price, Expiration_date, Effects, MedID } = req.body;
    console.log(req.body);
    const updateQuery = 'UPDATE medication SET Med_Name = ?, Price = ?, Expiration_date = ?, Effects = ? WHERE Med_Code = ? ';
    db.query(updateQuery, [Med_Name, Price, Expiration_date, Effects, MedID ], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        } else {
            res.status(201).json(result);
            console.log(result);
        }
    });
});

export default router;