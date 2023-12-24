

import React , {useState} from 'react'
import { Container , LeftSection , RightSection , Title , MainTitle  , WhiteContainer, Timing , TimingTitle , Span , Cols , Date , ButtonDate , SelectedButton , NextButton , Flex} from './Calendar.styles'
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PublicIcon from '@mui/icons-material/Public';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Link } from 'react-router-dom';
import '../App.css'

// i will semilate the time list


export default function Calendar() {

  const calendarData = ['11:00','11:15','11:30','13:45','14:00','14:15'];
  const [selectedTime, setSelectedTime] = useState(null);

  const handleButtonClick = (time) => {
    // Toggle the selected time
    setSelectedTime((prevSelectedTime) => (prevSelectedTime === time ? null : time));
  };
  // now i will add the onClick event

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
            <WhiteContainer />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <StaticDatePicker defaultValue={dayjs('2022-04-17')} />
                    </DemoContainer>
                </LocalizationProvider>
                <Cols>
                    <Date>Thursday, September 21</Date>
                    {calendarData.map((timeData) => (
                    <Flex key={timeData}>
                        <ButtonDate className={selectedTime === timeData && 'selected'} onClick={() => handleButtonClick(timeData)}>{timeData}</ButtonDate>
                        {selectedTime === timeData && (
                        <NextButton>
                            <Link to="details" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Next
                            </Link>
                        </NextButton>
                        )}
                    </Flex>
                    ))}
                </Cols>
            </RightSection>
        </Container>
    </>
  )
}
