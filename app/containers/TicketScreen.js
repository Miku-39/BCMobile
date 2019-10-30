import React, { Component } from 'react'
import { View,
  LayoutAnimation,
  NativeModules } from 'react-native'
import { Colors } from '../theme'
import Ticket from '../components/Ticket'
const fieldsProperties = [
{
  status:             { name: 'Статус', type: 'list' },
  type:               { name: 'Вид', type: 'list' },
  khimkiRequestType:  { name: 'Тип', type: 'list' },
  visitDate:          { name: 'Дата', type: 'date' },
  expirationDate:     { name: 'Действует до', type: 'date' },
  khimkiTime:         { name: 'Время', type: 'list' }
}, {
  visitorFullName:    { name: 'ФИО посетителя', type: 'text' },
  khimkiEmailGuest:   { name: 'E-mail посетителя', type: 'text' },
  khimkiGuestPhone:   { name: 'Телефон посетителя', type: 'text' },
}, {
  whoMeets:           { name: 'ФИО встречающего', type: 'text' },
  khimkiEmailMeeting: { name: 'E-mail встречающего', type: 'text' },
  phone:              { name: 'Телефон встречающего', type: 'text' }
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
  whereHappened:      { name: 'Место', type: 'text' },
  whatHappened:       { name: 'Что сделать', type: 'text' }
}, {
  note:               { name: 'Примечание', type: 'text' },
  managementCompanyComment: { name: 'Комментарий от администрации ХБП', type: 'text'}
}
]

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class TicketScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const { ticket } = navigation.state.params

        return ({
            title: ticket.number + ' - ' + ticket.status.alternativeName
        })
    }

    componentWillMount(){
      const { ticket } = this.props.navigation.state.params
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
