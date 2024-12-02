import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
dotenv.config({ path: 'D:/HK241/BTL DATA/Coding/Hospital_System/Login_secret_key.env' });

const router = express.Router();

router.get('/getProviders', (req, res) => {                                         //for getting all the providers on start up
    const sql = 'SELECT * FROM provider ORDER BY Provider_num';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});


router.get('/provider-search', (req, res) => {                                     //for searching provider
  const search = `%${req.query.search}%`
  const sql = `SELECT * FROM provider
               WHERE P_Name LIKE ? OR Provider_num LIKE ? 
               ORDER BY Provider_num`;
  db.query(sql, [search, search], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.post('/add-to-db', async(req,res) =>{                   //use to add new provider to database
    const { P_Name, Phone, Address } = req.body;
    console.log(req.body);
    const insertQuery = ` INSERT INTO provider (P_Name, Phone, Address) VALUES (?, ?, ?);`;
    db.query(insertQuery, [P_Name, Phone, Address], (err, results) => {
        if (err) {
            res.status(500).json({error: err}); 
            return;
        } 
        res.status(201).json(results);
    });
});

router.put('/update', (req, res) => {
    const { P_Name, Phone, Address, Provider_num } = req.body;
    console.log(req.body);
    const updateQuery = 'UPDATE provider SET P_Name = ?, Phone = ?, Address = ? WHERE Provider_num = ? ';
    db.query(updateQuery, [P_Name, Phone, Address, Provider_num], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        } else {
            res.status(201).json(result);
            console.log(result);
        }
    });
});

router.delete('/delete', (req, res) => {
    const { Provider_num } = req.body;
    console.log(req.body);
    const deleteQuery = 'DELETE FROM provider where Provider_num = ?';
    db.query(deleteQuery, [Provider_num], (err, result) => {
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