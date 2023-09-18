import React from 'react'
import { Container  , Title , Detail , Infos , Flex , TitleM} from './Summit.styles'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Info } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PublicIcon from '@mui/icons-material/Public';
import VideocamIcon from '@mui/icons-material/Videocam';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Stack from '@mui/material/Stack';

export default function Summit() {
  return (
    <Container>
        <Title><CheckCircleOutlineIcon style={{ color: '#439c40', fontSize: 38  }} />You are scheduled</Title>
        <Detail>A calendar invitation has been sent to your email adress.</Detail>
        <Infos>
            <h2>HR Interview (on Google Meet)</h2>
            <Flex><PersonIcon style={{ color : '#868a86' , marginRight : '6px' }}/>Anne-Laure Kupferberg</Flex>
            <Flex><CalendarTodayIcon style={{ color : '#868a86' , marginRight : '6px' }}/>14:15 - 15:15, Thursday, September 21, 2023</Flex>
            <Flex><PublicIcon style={{ color : '#868a86' , marginRight : '6px' }}/>Central European Time</Flex>
            <Flex><VideocamIcon style={{ color : '#868a86' , marginRight : '6px' }}/>Web conferencing details to follow</Flex>
        </Infos>
        <TitleM>Schedule your own meetings with Calendly for free</TitleM>
        <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<GoogleIcon />}>
                Sign up with Google
            </Button>
            <Button variant="contained" endIcon={<MicrosoftIcon />}>
                Sign up with Microsoft
            </Button>
        </Stack>
    </Container>
  )
}
