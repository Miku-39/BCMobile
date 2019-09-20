import React, { Component } from 'react'
import { View, Text, Alert, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent'

export default class MainScreenContainer extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Химки Бизнес Парк'
        })
    }

    render = () => {
        const { navigate } = this.props.navigation
        return (

          <MainComponent
              addVisitTicket={() => navigate('Visitor', {ticketType: 'VISITOR'})}
              addCardTicket={() => navigate('Service', {ticketType: 'CARD'})}
              addGoodsTicket={() => navigate('Goods', {ticketType: 'GOODS'})}
              addServiceTicket={() => navigate('Service', {ticketType: 'SERVICE'})}
              openTickets={() => navigate('Tickets')}
          />
        )
    }
}
