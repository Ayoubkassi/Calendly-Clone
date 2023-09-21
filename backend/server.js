// index.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer'); 


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// SQLite Database setup
const db = new sqlite3.Database('./database.db');

// Create 'availabilities' and 'reservations' tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS availabilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start DATETIME NOT NULL,
      end DATETIME NOT NULL
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start DATETIME NOT NULL,
      end DATETIME NOT NULL,
      title TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
});

// REST API endpoints for CRUD operations

// List available slots
app.get('/api/v1/availabilities', (req, res) => {
  db.all('SELECT * FROM availabilities', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(rows);
  });
});


// Create availability
app.post('/api/v1/availabilities', (req, res) => {
  const { start, end } = req.body;
  db.run(
    'INSERT INTO availabilities (start, end) VALUES (?, ?)',
    [start, end],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(201).json({ message: 'Availability created successfully' });
    }
  );
});

// Delete availability
app.delete('/api/v1/availabilities/:id', (req, res) => {
  const id = req.params.id;
  db.run(
    'DELETE FROM availabilities WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Availability deleted successfully' });
    }
  );
});

// Create reservation
app.post('/api/v1/reservations', async (req, res) => {
  const { start, end, title, email } = req.body;
  db.run(
    'INSERT INTO reservations (start, end, title, email) VALUES (?, ?, ?, ?)',
    [start, end, title, email],
    async (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      // Create a transporter with your SMTP server details
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'Gmail', // You can use other SMTP providers as well
        auth: {
          user: 'akassi072@gmail.com',
          pass: 'IKRAM.hiba2004',
        },
      });

      // Email message
      const mailOptions = {
        from: 'ayoubkassi87@gmail.com',
        to: email,
        subject: 'Reservation Confirmation',
        text: `Your reservation for ${title} on ${start} - ${end} has been confirmed. Here is the Google Meet link: INSERT_GOOGLE_MEET_LINK_HERE`,
      };

      try {
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Reservation created successfully and email sent' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending email' });
      }
    }
  );
});

// Delete reservation
app.delete('/api/v1/reservations/:id', (req, res) => {
  const id = req.params.id;
  //const email = req.query.email;
  db.run(
    'DELETE FROM reservations WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Reservation deleted successfully' });
    }
  );
});

// List reservations
app.get('/api/v1/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(rows);
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});