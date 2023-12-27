

import React , {useState ,  useEffect } from 'react'
import { Container , TimeScroller, LeftSection , RightSection , Title , MainTitle  , WhiteContainer, Timing , TimingTitle , Span , Cols , Date , ButtonDate , SelectedButton , NextButton , Flex} from './Calendar.styles'
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

    const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today's date
    const [availabilities, setAvailabilities] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        // Fetch data from the backend based on the selected date
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        fetch(`http://localhost:3000/getGoogleCalendarEvents/${formattedDate}`)
          .then((response) => response.json())
          .then((data) => {
            // Filter availabilities from 8:00 AM to 8:00 PM
            const filteredAvailabilities = data.availabilities.filter(
              (timeData) => timeData.start >= '08:00' && timeData.end <= '20:00'
            );
            setAvailabilities(filteredAvailabilities);
          })
          .catch((error) => {
            console.error('Error fetching availabilities:', error.message);
          });
      }, [selectedDate]);


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
              {/* Use the selectedDate state variable */}
              <StaticDatePicker value={selectedDate} onChange={(date) => setSelectedDate(date)} />
            </DemoContainer>
          </LocalizationProvider>
          <Cols>
            <Date>{selectedDate.format('dddd, MMMM D')}</Date>
            <TimeScroller>
              {availabilities.map((timeData) => (
                <Flex key={timeData.start}>
                  <ButtonDate className={selectedTime === timeData.start && 'selected'} onClick={() => handleButtonClick(timeData.start)}>
                    {`${timeData.start} - ${timeData.end}`}
                  </ButtonDate>
                  {selectedTime === timeData.start && (
                    <NextButton>
                      <Link to="details" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Next
                      </Link>
                    </NextButton>
                  )}
                </Flex>
              ))}
            </TimeScroller>
          </Cols>
        </RightSection>
        </Container>
    </>
  )
}
