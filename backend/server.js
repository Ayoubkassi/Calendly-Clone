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

// Create 'availabilities' and 'reservations' and 'users' tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      userType TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS availabilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start DATETIME NOT NULL,
      end DATETIME NOT NULL,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start DATETIME NOT NULL,
      end DATETIME NOT NULL,
      title TEXT NOT NULL,
      email TEXT NOT NULL,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
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


// CRUD operations for users
app.get('/api/v1/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/v1/users', (req, res) => {
  const { username, email, password, userType } = req.body;
  db.run(
    'INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)',
    [username, email, password, userType],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(201).json({ message: 'User created successfully' });
    }
  );
});

// Update user information (e.g., username, password, email)
app.put('/api/v1/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;
  db.run(
    'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
    [username, email, password, userId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Delete user
app.delete('/api/v1/users/:id', (req, res) => {
  const userId = req.params.id;
  db.run(
    'DELETE FROM users WHERE id = ?',
    [userId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    }
  );
});




// Create reservation specific to a user
app.post('/api/v1/users/:userId/reservations', async (req, res) => {
  const userId = req.params.userId;
  const { start, end, title, email } = req.body;
  db.run(
    'INSERT INTO reservations (start, end, title, email, userId) VALUES (?, ?, ?, ?, ?)',
    [start, end, title, email, userId],
    async (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const transporter = nodemailer.createTransport({
        // Email configuration
      });

      const mailOptions = {
        // Email options
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Reservation created successfully and email sent' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending email' });
      }
    }
  );
});

// Read all reservations specific to a user
app.get('/api/v1/users/:userId/reservations', (req, res) => {
  const userId = req.params.userId;
  db.all('SELECT * FROM reservations WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(rows);
  });
});

// Read a specific reservation for a user
app.get('/api/v1/users/:userId/reservations/:id', (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  db.get('SELECT * FROM reservations WHERE id = ? AND userId = ?', [id, userId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Reservation not found for the user' });
      return;
    }

    res.json(row);
  });
});

// Update reservation specific to a user
app.put('/api/v1/users/:userId/reservations/:id', (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const { start, end, title, email } = req.body;
  db.run(
    'UPDATE reservations SET start = ?, end = ?, title = ?, email = ? WHERE id = ? AND userId = ?',
    [start, end, title, email, id, userId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Reservation updated successfully' });
    }
  );
});

// Delete reservation specific to a user
app.delete('/api/v1/users/:userId/reservations/:id', (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  db.run(
    'DELETE FROM reservations WHERE id = ? AND userId = ?',
    [id, userId],
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




// Create availability specific to a user
app.post('/api/v1/users/:userId/availabilities', (req, res) => {
  const userId = req.params.userId;
  const { start, end } = req.body;
  db.run(
    'INSERT INTO availabilities (start, end, userId) VALUES (?, ?, ?)',
    [start, end, userId],
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

// Read all availabilities specific to a user
app.get('/api/v1/users/:userId/availabilities', (req, res) => {
  const userId = req.params.userId;
  db.all('SELECT * FROM availabilities WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(rows);
  });
});

// Read a specific availability for a user
app.get('/api/v1/users/:userId/availabilities/:id', (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  db.get('SELECT * FROM availabilities WHERE id = ? AND userId = ?', [id, userId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Availability not found for the user' });
      return;
    }

    res.json(row);
  });
});

// Update availability specific to a user
app.put('/api/v1/users/:userId/availabilities/:id', (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const { start, end } = req.body;
  db.run(
    'UPDATE availabilities SET start = ?, end = ? WHERE id = ? AND userId = ?',
    [start, end, id, userId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Availability updated successfully' });
    }
  );
});

// Delete availability specific to a user
app.delete('/api/v1/users/:userId/availabilities/:id', (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  db.run(
    'DELETE FROM availabilities WHERE id = ? AND userId = ?',
    [id, userId],
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




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});