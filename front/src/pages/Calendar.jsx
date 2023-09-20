

import React from 'react'
import { Container , LeftSection , RightSection , Title , MainTitle  , Timing , TimingTitle , Span , Cols , Date , ButtonDate , SelectedButton , NextButton , Flex} from './Calendar.styles'
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PublicIcon from '@mui/icons-material/Public';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



export default function Calendar() {
  return (
    <>
        <Container>
            <LeftSection>
                <Title>Anne-Laure Kupferberg</Title>
                <MainTitle>HR Interview (on Google Meet)</MainTitle>
                <Timing><AccessTimeIcon />1 hr </Timing>
                <TimingTitle><VideocamIcon /><Span>Web Conferencing details provided upon confirmation</Span></TimingTitle>
                <Title>Former Time</Title>
                <TimingTitle><CalendarTodayIcon /><Span>15:00 - 16:00,Friday, September 15, 2023</Span></TimingTitle>
                <TimingTitle><PublicIcon /><Span>Central European Time</Span></TimingTitle>
            </LeftSection>
            <RightSection>
            {/* <DemoItem label="Static variant">
                <StaticDatePicker defaultValue={dayjs('2022-04-17')} />
            </DemoItem> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <StaticDatePicker defaultValue={dayjs('2022-04-17')} />
                </DemoContainer>
            </LocalizationProvider>
            <Cols>
                <Date>Thursday, September 21</Date>
                <ButtonDate>11:00</ButtonDate>
                <ButtonDate>11:15</ButtonDate>
                <ButtonDate>11:30</ButtonDate>
                <ButtonDate>13:45</ButtonDate>
                <ButtonDate>14:00</ButtonDate>
                <Flex>
                    <SelectedButton>14:15</SelectedButton>
                    <NextButton>Next</NextButton>
                </Flex>
            </Cols>
            </RightSection>
        </Container>
    </>
  )
}
