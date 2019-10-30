import React, { Component } from 'react'
import { View, Text, Alert, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent'

import * as selectors from '../middleware/redux/selectors'
import { getSession } from '../middleware/redux/selectors'

@connect(
    store => ({
        session: getSession(store)
    })
)

export default class MainScreenContainer extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Кларис'
        })
    }

    componentWillMount() {
        const { session } = this.props

        this.setState({session: session})
    }

    render = () => {
        const { navigate } = this.props.navigation
        const { session } = this.state
        return (

          <MainComponent
              addVisitTicket={() => navigate('Visitor', {ticketType: 'VISITOR'})}
              addCarTicket={() => navigate('Visitor', {ticketType: 'CAR'})}
              addCardTicket={() => navigate('Service', {ticketType: 'CARD'})}
              addGoodsTicket={(type) => navigate('Goods', {ticketType: type})}
              addServiceTicket={() => navigate('Service', {ticketType: 'SERVICE'})}
              openTickets={(type) => navigate('Tickets', {type: type})}
              session={session}
          />
        )
    }
}
