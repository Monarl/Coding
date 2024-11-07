import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import dotenv from 'dotenv';
dotenv.config({path: 'E:/Coding/Hospital_System/Login_secret_key.env'});

const db = new LowSync(new JSONFileSync('user.json'), {})
db.read()
const router = express.Router()
const jwtSecretKey = process.env['key']

router.get('/', (_req, res) => {
    res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication')
  })

router.post('/auth', (req, res) => {
const { email, password } = req.body

// Look up the user entry in the database
const users = db.data.users || [];  // Make sure db.data.users exists
const user = users.filter((user) => email === user.email);

// If found, compare the hashed passwords and generate the JWT token for the user
if (user.length >= 1) {
    bcrypt.compare(password, user[0].password, function (_err, result) {
    if (!result) {
        return res.status(401).json({ message: 'Invalid password' })
    } else {
        let loginData = {
        email,
        signInTime: Date.now(),
        }

        const token = jwt.sign(loginData, jwtSecretKey)
        res.status(200).json({ message: 'success', token })
    }
    })
    // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
} else if (user.length === 0) {
    bcrypt.hash(password, 10, function (_err, hash) {
    console.log({ email, password: hash })
    console.log(users)
    console.log(db.data)
    db.data.users.push({ email, password: hash });
    db.write()

    let loginData = {
        email,
        signInTime: Date.now(),
    }

    const token = jwt.sign(loginData, jwtSecretKey)
    res.status(200).json({ message: 'success', token })
    })
}
})

router.post('/verify', (req, res) => {
    const tokenHeaderKey = 'jwt-token'
    const authToken = req.headers[tokenHeaderKey]
    try {
      const verified = jwt.verify(authToken, jwtSecretKey)
      if (verified) {
        return res.status(200).json({ status: 'logged in', message: 'success' })
      } else {
        // Access Denied
        return res.status(401).json({ status: 'invalid auth', message: 'error' })
      }
    } catch (error) {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' })
    }
  })

router.route('/check-account').post((req, res) => {
const { email } = req.body

console.log(req.body)

const users = db.data.users || [];
const user = users.filter((user) => email === user.email);

console.log(user.length)

res.status(200).json({
    status: user.length === 1 ? 'User exists' : 'User does not exist',
    userExists: user.length === 1,
})
})

export default router