import React from 'react'
import { Box } from '@mui/system'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { SubButton } from '../pages/CalendarDetails.styles';


function FormEvent() {
  return (
    <div>
        <h2 style={{ textAlign : 'center' , marginBottom : '30px' }}>Create Meet Event</h2>
        <Box sx={{ display: 'flex' , marginBottom : '30px' , justifyContent : 'space-between' }}>
            <TextField label="Title" color="primary" focused style={{ width : '45%' }} />
            <TextField label="Guest email" color="primary" focused style={{ width : '45%' }} />
        </Box>
        <TextField label="Guest email" rows={4} multiline color="primary" focused style={{ width : '45%' , marginBottom : '20px' }} />
        <Box sx={{ display: 'flex' , justifyContent : 'space-between' }}>
            <TextField
                focused
                color="primary"
                label="Minutes"
                id="outlined-start-adornment"
                InputProps={{
                    endAdornment: <InputAdornment position="start">Min</InputAdornment>,
                }}
            />
        </Box>
        
        <button style={{ backgroundColor : '#363532'  ,border : 'none' , color : 'white' , marginTop : '105px' , borderRadius : '20px' , marginLeft : '38vw'  }}>
            Create Event
        </button>
       
    </div>
  )
}

export default FormEvent
