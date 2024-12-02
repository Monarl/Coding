import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from "./index.js";
import dotenv from 'dotenv';
dotenv.config({ path: '../../Login_secret_key.env' });

const router = express.Router();
const jwtSecretKey = process.env['key'];

router.get('/', (_req, res) => {
    res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication');
});

router.post('/auth', (req, res) => {
    const { email, password } = req.body;

    // Query the user from MySQL without Promises
    db.query('SELECT * FROM USER WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        
        const user = results[0];
        if (user) {
            // Compare password
            bcrypt.compare(password, user.Password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Invalid password' });
                }

                // Generate JWT token
                const loginData = {
                    email,
                    signInTime: Date.now(),
                };
                const token = jwt.sign(loginData, jwtSecretKey);
                res.status(200).json({ message: 'success', 
                                       token, 
                                       userCode: user.User_Code,
                                       Role: user.Role });
            });
        } else {
            // If user not found, hash the password and create new entry
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return res.status(500).json({ message: 'Error hashing password' });

                const newUser = { User_Code: 'new_code', Email: email, Password: hash, Role: 'User' };
                db.query('INSERT INTO USER SET ?', newUser, (err) => {
                    if (err) return res.status(500).json({ message: 'Error saving user' });

                    const token = jwt.sign({ email, signInTime: Date.now() }, jwtSecretKey);
                    res.status(200).json({ message: 'success', token });
                });
            });
        }
    });
});

router.post('/verify', (req, res) => {
    const tokenHeaderKey = 'jwt-token';
    const authToken = req.headers[tokenHeaderKey];
    
    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        if (verified) {
            return res.status(200).json({ status: 'logged in', message: 'success' });
        } else {
            return res.status(401).json({ status: 'invalid auth', message: 'error' });
        }
    } catch (error) {
        return res.status(401).json({ status: 'invalid auth', message: 'error' });
    }
});

router.post('/check-account', (req, res) => {
    const { email } = req.body;

    db.query('SELECT * FROM USER WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        
        res.status(200).json({
            status: results.length > 0 ? 'User exists' : 'User does not exist',
            userExists: results.length > 0,
        });
    });
});

export default router;
