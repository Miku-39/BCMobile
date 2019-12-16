import React, { Component } from 'react'
import { View,
  LayoutAnimation,
  NativeModules } from 'react-native'
import { Colors } from '../theme'
import Ticket from '../components/Ticket'
import * as selectors from '../middleware/redux/selectors'
import { connect } from 'react-redux'

const fieldsProperties = [
{
  status:             { name: 'Статус', type: 'list' },
  type:               { name: 'Вид', type: 'list' },
  visitDate:          { name: 'Дата', type: 'date' },
  expirationDate:     { name: 'Действует до', type: 'date' }
}, {
  visitorFullName:    { name: 'ФИО посетителя', type: 'text' },
  khimkiEmailGuest:   { name: 'E-mail посетителя', type: 'text' },
  khimkiGuestPhone:   { name: 'Телефон посетителя', type: 'text' },
}, {
  whoMeets:           { name: 'ФИО встречающего', type: 'text' },
  khimkiEmailMeeting: { name: 'E-mail встречающего', type: 'text' },
  phone:              { name: 'Телефон встречающего', type: 'text' }
}, {
  file:               { name: 'Файл', type: 'file'}
}, {
  carNumber:          { name: 'Номер авто', type: 'text' },
  carModelText:       { name: 'Модель авто', type: 'text' },
  parkingPlace:       { name: 'Место на парковке', type: 'text' },
  parking:            { name: 'Парковка', type: 'list' }
}, {
  companyName:        { name: 'Компания-поставщик', type: 'text' },
  materialValuesData: { name: 'Данные материальных ценностей', type: 'text' },
  khimkiAccessPremises:{ name: 'Маршрут перемещения', type: 'text' }
}, {
  whereHappened:      { name: 'Где произошло', type: 'text' },
  whatHappened:       { name: 'Что сделать', type: 'text' }
}, {
  note:               { name: 'Примечание', type: 'text' },
  managementCompanyComment: { name: 'Комментарий от администрации ХБП', type: 'text'}
}
]

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);


@connect(
    store => ({
        session: selectors.getSession(store)
    })
)

export default class TicketScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const { ticket } = navigation.state.params

        return ({
            title: ticket.number + ' - ' + ticket.status.alternativeName
        })
    }

    componentWillMount(){
      const { ticket } = this.props.navigation.state.params
      if(this.props.session.isLesnaya &&
         (this.props.session.roles.includes('restrictedAdministratorBC') ||
         this.props.session.roles.includes('administratorBC')) &&
         this.props.session.roles.includes('makingAgreementBC'))
      {
           fieldsProperties[0]['company'] = { name: 'Арендатор', type: 'list' }
      }
      this.setState({ticket: ticket})
    }

    componentWillReceiveProps(nextProps) {
      const { ticket } = this.props.navigation.state.params
      this.setState({ticket: ticket})
    }

    updateItem = (ticket) => {
      const { updateItem } = this.props.navigation.state.params
      updateItem(ticket)
      LayoutAnimation.easeInEaseOut();
      this.setState({ticket: ticket})
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Ticket ticket={this.state.ticket}
                        fieldsProperties={fieldsProperties}
                        updateItem={this.updateItem}
                        goBack={this.props.navigation.goBack}/>
            </View>
        )
    }
}
