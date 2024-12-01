import app from "./server.js"
import mysql from 'mysql2';

const port = 8000

// Create MySQL connection using environment variables
const db = mysql.createConnection({
    host: 'localhost', // It's better to use environment variables for sensitive data
    user: 'root',
    password: 'Nhvu2311@@',
    database: 'hospital',
  });
  
  // Connect to MySQL
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database.');
  });
app.listen(port, '0.0.0.0', () => {
        console.log(`listening on port ${port}`)
    })


export {db}