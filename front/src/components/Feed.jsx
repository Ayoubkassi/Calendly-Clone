import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardCom from './CardCom';
import { Flex } from './Feed.styles';
import FormEvent from './FormEvent';
import GraphData from './GraphData';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Feed() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [reservations, setReservations] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

   // Function to get reservations
   const getReservations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/1/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data); // Update the reservations state with the fetched data
      } else {
        console.error('Failed to get reservations:', response.statusText);
      }
    } catch (error) {
      console.error('Error getting reservations:', error.message);
    }
  };

  // useEffect to fetch reservations when the component mounts
  useEffect(() => {
    getReservations();
  }, [reservations]); // The empty dependency array ensures this effect runs only once, equivalent to componentDidMount

  return (
    <Box sx={{ bgcolor: 'background.paper' , width : '85vw' , marginLeft : '-14vw' }}>
      <AppBar position="static" style={{ backgroundColor : '#363532'  }} >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Event Types" {...a11yProps(0)} />
          <Tab label="Scheduled Events" {...a11yProps(1)} />
          <Tab label="Workflows" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
            <>
            <Flex>

            {reservations.map(({ minutes , title , id }) => (
              <CardCom title={title} dure={minutes} key={id} />
            ))}
                {/* <CardCom dure={15} title="Interview back end intern"  />
                <CardCom dure={60} title="RH Alternance" color="#e36e14" />
                <CardCom dure={30} title="Webinar"  />
                <CardCom dure={45} title="Team meet"  /> */}
            </Flex>
            </>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <FormEvent onChange = { handleChangeIndex } />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <GraphData />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}