

import React from 'react'
import Navbar from '../components/Navbar'
import { Title , Container , Picture , Flex , Email , Line } from './Dashboard.styles'
import CardCom from '../components/CardCom'

export default function Dashboard() {
  return (
    <Container>
        <Navbar />
        <Title>My Calendar App</Title>
        <Flex><Picture>P</Picture>Ayoub Kassi</Flex>
        <Email>ayoubkassi.contact@gmail.com</Email>
        <Line />
        <Flex>
            <CardCom dure={15}/>
            <CardCom dure={30}/>
            <CardCom dure={60}/>
        </Flex>
    </Container>
  )

}
