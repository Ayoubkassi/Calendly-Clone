// index.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer'); 
const cors = require('cors'); // Import the cors middleware


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
      minutes INTEGER,
      title TEXT NOT NULL,
      email TEXT NOT NULL,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});


// REST API endpoints for CRUD operations




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

// Function to get a user by ID from the database
const getUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};


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

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Extracting values from the request body and setting default values if not provided
    const { start = 'Default Start Time', end = 'Default End Time', title, email , minutes } = req.body;

    db.run(
      'INSERT INTO reservations (start, end, title, email, minutes ,  userId) VALUES (?, ?, ?, ?, ?, ?)',
      [start, end, title, email, minutes , userId],
      async (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ayoubkassi87@gmail.com',
            pass: 'ehuw pijn pqyz ltdo',
          },
        });

        const mailOptions = {
          from: 'ayoubkassi87@gmail.com',
          to: email,
          subject: `Welcome - Available for a first interview Ayoub?`,
          text: `Hello Ayoub,

          Thank you for your interest in QAIS!

          Your profile is very interesting, and we would like to organize a first video call to discuss your background and answer any questions you may have.

          To make things easier, you can book a slot in my calendar to organize a video call: [Schedule Video Call](https://calendly.com/ayoub-kassi/60min)

          In order to be well prepared, have a look at our interview guide.

          I very much look forward to hearing back from you 🙏

          Ayoub Kassi`,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Read all reservations specific to a user
app.get('/api/v1/users/:userId/reservations', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }


    db.all('SELECT * FROM reservations WHERE userId = ?', [userId], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a specific reservation for a user
app.get('/api/v1/users/:userId/reservations/:id', async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update reservation specific to a user
app.put('/api/v1/users/:userId/reservations/:id', async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const { start, end, title, email , minutes } = req.body;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    db.run(
      'UPDATE reservations SET start = ?, end = ?, title = ?, email = ? , minutes = ? WHERE id = ? AND userId = ?',
      [start, end, title, email, minutes , id, userId],
      (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json({ message: 'Reservation updated successfully' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete reservation specific to a user
app.delete('/api/v1/users/:userId/reservations/:id', async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Create availability specific to a user
app.post('/api/v1/users/:userId/availabilities', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all availabilities specific to a user
app.get('/api/v1/users/:userId/availabilities', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    db.all('SELECT * FROM availabilities WHERE userId = ?', [userId], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a specific availability for a user
app.get('/api/v1/users/:userId/availabilities/:id', async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update availability specific to a user
app.put('/api/v1/users/:userId/availabilities/:id', async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const { start, end } = req.body;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete availability specific to a user
app.delete('/api/v1/users/:userId/availabilities/:id', async (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});