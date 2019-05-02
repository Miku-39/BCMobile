import React, { Component } from 'react'
import { View, Text, Alert, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent'

export default class MainScreenContainer extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Кларис'
        })
    }

    render = () => {
        const { navigate } = this.props.navigation
        return (

          <MainComponent
              addVisitTicket={() => navigate('Visitor', {ticketType: 'VISITOR'})}
              addCardTicket={() => navigate('Visitor', {ticketType: 'CARD'})}
              addCarTicket={() => navigate('Ticket', {showCarFields: true, showGoodsFields: false, ticketType: 'CAR'})}
              addGoodsArriveTicket={() => navigate('Ticket', {showCarFields: true, showGoodsFields: true, ticketType: 'GOODS_ARRIVE'})}
              addGoodsLeaveTicket={() => navigate('Ticket', {showCarFields: true, showGoodsFields: true, ticketType: 'GOODS_LEAVE'})}
              addServiceTicket={() => navigate('Service', {ticketType: 'SERVICE'})}
              addAltServiceTicket={() => navigate('Service', {ticketType: 'ALT_SERVICE'})}
              openTickets={() => navigate('Tickets')}
          />
        )
    }
}
