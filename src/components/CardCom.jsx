

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Line } from '../pages/Summit.styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Flexi } from '../pages/Calendar.styles';
import ShareIcon from '@mui/icons-material/Share';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function CardCom({dure}) {
  return (
    <Card sx={{ minWidth: 375 , marginLeft : '100px' , boxShadow: '0px 0px 10px 5px rgba(128, 128, 128, 0.3)' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {dure} Minute  
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {dure} min , One-on-One
        </Typography>
        
      </CardContent>
      <CardActions>
        <Button size="small">View booking page</Button>
      </CardActions>
      <Line />
      <Flexi>
        <div><ContentCopyIcon />Copy Link </div>
        <Button variant="contained" startIcon={<ShareIcon />}>
                Share
        </Button>
      </Flexi>
    </Card>
  )
}
