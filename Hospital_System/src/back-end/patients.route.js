import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import {db} from "./index.js"

// Load environment variables
<<<<<<< HEAD
dotenv.config({ path: '../../Login_secret_key.env' });
=======
dotenv.config({ path: "../../Login_secret_key.env" });
>>>>>>> 86fa40a2d439e994dbe8053e5498fae88bb2b8dc

const router = express.Router();

const adjustDate = (dateString) => {
  if (!dateString) return null; // Return null if date string is empty
  const date = new Date(dateString);
  date.setDate(date.getDate()); // Add 1 day
  return date.toISOString().split("T")[0]; // Return formatted date
};



// Define an API endpoint
router.get('/doctor-list', (req, res) => {
  const sql = 'SELECT * FROM DOCTOR ORDER BY Doc_Code';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.get('/nurse-list', (req, res) => {
  const sql = 'SELECT * FROM NURSE ORDER BY Nurse_Code';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.get('/medication-list', (req, res) => {
  const sql = 'SELECT Med_Code, Med_Name FROM MEDICATION ORDER BY Med_Code';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.get('/test', (req, res) => {
  const sql = 'SELECT * FROM PATIENT ORDER BY Patient_Code';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.get('/patient-search', (req, res) => {
  const search = `%${req.query.search}%`
  const sql = `SELECT * FROM PATIENT p 
               WHERE F_name LIKE ? OR L_name LIKE ? OR p.Patient_Code LIKE ? 
               ORDER BY Patient_Code`;
  db.query(sql, [search, search, search], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.get('/patient-detail', (req, res) => {
  const search = `%${req.query.search}%`
  const sql = ((req.query.search).substring(0,2) == 'IP')? `SELECT p.*, td.*, ip.*, tm.Med_Code FROM PATIENT p 
               LEFT JOIN TREATMENT_DETAIL td ON p.Patient_Code = td.IP_Code
               INNER JOIN INPATIENT ip ON p.Patient_Code = ip.IP_Code
               LEFT JOIN TREATMENT_MED tm ON p.Patient_Code = tm.IP_Code 
                                            AND td.Doc_Code = tm.Doc_Code 
                                            AND td.\`Start date\` = tm.\`Start date\` 
                                            AND td.\`End date\` = tm.\`End date\`
               WHERE p.Patient_Code LIKE ? 
               ORDER BY Patient_Code` : `SELECT p.*, ed.*, op.*, em.Med_Code FROM PATIENT p 
               LEFT JOIN EXAMINATION_DETAIL ed ON p.Patient_Code = ed.OP_Code
               INNER JOIN OUTPATIENT op ON p.Patient_Code = op.OP_Code
               LEFT JOIN EXAMINATION_MED em ON p.Patient_Code = em.OP_Code
                                              AND ed.Doc_Code = em.Doc_Code
                                              AND ed.\`Examination date\` = em.\`Examination date\`
               WHERE p.Patient_Code LIKE ? 
               ORDER BY Patient_Code`;
  db.query(sql, [search], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

router.delete('/delete-patients', (req, res) => {
  const { patient } = req.body;
  console.log(patient)

  const sql = `DELETE FROM patient WHERE Patient_Code = ?`

  db.query(sql, patient.Patient_Code, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query failed.' });
    }

    console.log('Query result:', result);
    return res.sendStatus(200); // Respond with success
  });
});
router.delete('/delete-records', (req, res) => {
  const { patient } = req.body;
  console.log(patient)

  const inpatient = [
    patient.Patient_Code,
    patient["Start date"],
    patient["End date"],
    patient.Doc_Code,
    patient.Med_Code
  ]

  const outpatient = [
    patient.Patient_Code,
    patient["Examination date"],
    patient.Doc_Code,
    patient.Med_Code
  ]

  const sql = ((patient.Patient_Code).substring(0,2) == 'IP')? `CALL delete_records_inpatient(?, ?, ?, ?, ?)` 
                                                         : `CALL delete_records_outpatient(?, ?, ?, ?)`
  const param = ((patient.Patient_Code).substring(0,2) == 'IP')? inpatient : outpatient
  db.query(sql, param, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query failed.' });
    }

    console.log('Query result:', result);
    return res.sendStatus(200); // Respond with success
  });
});
router.put('/patient-update', (req, res) => {
  const updatedPatient = req.body.patientData;
  const patient_records = req.body.patients;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send('Failed to initiate transaction');
    }

    // Function to build values array and query for each patient
    const buildUpdateQuery = (record) => {
      const values = [
        updatedPatient.F_name,
        updatedPatient.L_name,
        updatedPatient.Phone_num,
        updatedPatient.Gender,
        adjustDate(updatedPatient.Dob),
        updatedPatient.Address,
        adjustDate(updatedPatient.Dateofadmission),
        updatedPatient.Diagnosis,
        updatedPatient.Fee,
        adjustDate(updatedPatient.Dateofdischarge),
        updatedPatient.Sickroom,
        updatedPatient.Nurse_Code,
        updatedPatient.id
      ];

      const treatment = [
        adjustDate(record['Start date']),
        adjustDate(record['End date']),
        record['new_Result'] || record['Result'],
        record['Doc_Code'],
        adjustDate(record['Examination date']),
        record['new_Diagnosis'] || record['Diagnosis'],
        record['new_Fee'] || record['Fee'],
        adjustDate(record['new_Next_examination'] || record['Next_examination'])
      ];

      const newTreatment = [
        adjustDate(record['new_Start date'] || record['Start date']),
        adjustDate(record['new_End date'] || record['End date']),
        record['new_Doc_Code'] || record['Doc_Code'],
        adjustDate(record['new_Examination date'] || record['Examination date'])
      ]

      //console.log(newTreatment, record['new_Med_Code'] || record['Med_Code']);

      const finalValues = (updatedPatient.id.substr(0, 2) === "IP") ? 
        [...values, ...treatment.slice(0, 4), ...newTreatment.slice(0, 3), record['Med_Code'], record['new_Med_Code'] || record['Med_Code']] : 
        [...values.slice(0, 6), values[values.length - 1], ...treatment.slice(3), ...newTreatment.slice(2), record['Med_Code'], record['new_Med_Code'] || record['Med_Code']];

      console.log(finalValues) 
      const query = (updatedPatient.id.substr(0, 2) === "IP") ? 
        `CALL update_inpatient(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);` : 
        `CALL update_outpatient(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      return { query, finalValues };
    };

    // Array to hold promises for each query execution
    const updatePromises = patient_records.map((record) => {
      const { query, finalValues } = buildUpdateQuery(record);
      return new Promise((resolve, reject) => {
        db.query(query, finalValues, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    });

    // Execute all updates within the transaction
    Promise.all(updatePromises)
      .then(() => {
        db.commit((commitErr) => {
          if (commitErr) {
            db.rollback(() => {
              res.status(500).send('Failed to commit transaction');
            });
          } else {
            res.send('All patients updated successfully');
          }
        });
      })
      .catch((err) => {
        console.error(err);
        db.rollback(() => {
          res.status(500).send('Failed to update patients, all changes reverted');
        });
      });
  });
});

export default router;
