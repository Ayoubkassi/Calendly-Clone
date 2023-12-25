import React, { useState } from 'react';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { SubButton } from '../pages/CalendarDetails.styles';

function FormEvent({ onChange }) {
  const [title, setTitle] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [description, setDescription] = useState('');
  const [minutes, setMinutes] = useState('');

  const createEvent = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/1/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          email: guestEmail,
          description,
          minutes,
        }),
      });

      if (response.ok) {
        console.log('Event created successfully');
        // Optionally, you can reset the form fields after a successful creation
        setTitle('');
        setGuestEmail('');
        setDescription('');
        setMinutes('');
        onChange(0);
      } else {
        console.error('Failed to create event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error.message);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Meet Event</h2>
      <Box sx={{ display: 'flex', marginBottom: '30px', justifyContent: 'space-between' }}>
        <TextField
          label="Title"
          color="primary"
          focused
          style={{ width: '45%' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Guest email"
          color="primary"
          focused
          style={{ width: '45%' }}
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
      </Box>
      <TextField
        label="Description"
        rows={4}
        multiline
        color="primary"
        focused
        style={{ width: '45%', marginBottom: '20px' }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          focused
          color="primary"
          label="Minutes"
          id="outlined-start-adornment"
          InputProps={{
            endAdornment: <InputAdornment position="start">Min</InputAdornment>,
          }}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </Box>

      <button
        style={{
          backgroundColor: '#363532',
          border: 'none',
          color: 'white',
          marginTop: '15px',
          borderRadius: '20px',
          marginLeft: '38vw',
        }}
        onClick={createEvent}
      >
        Create Event
      </button>
    </div>
  );
}

export default FormEvent;
