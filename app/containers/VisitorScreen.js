import React, { Component } from 'react'
import { View,
  DatePickerAndroid,
  DatePickerIOS,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import VisitorTicketEditor from '../components/VisitorTicketEditor'
import Loader from '../components/Loader'
import * as selectors from '../middleware/redux/selectors'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

import { getSession } from '../middleware/redux/selectors'
import { storeCredentials, loadCredentials } from '../middleware/utils/AsyncStorage'
const NEW_TICKET_STATUS_ID = '4285215000';

const VISITOR_TICKET_TYPE = '393629542000';
const CARD_TICKET_TYPE = '437149164000';

const headerButtonsHandler = { save: () => null }


@connect(
    store => ({
        employeeId: selectors.getEmployeeId(store),
        companyId: selectors.getCompanyId(store),
        isAdding: selectors.getIsTicketAdding(store),
        fileIsAdding: selectors.getIsFileAdding(store),
        added: selectors.getIsTicketAdded(store),
        fileAdded: selectors.getIsFileAdded(store),
        fileId: selectors.getFileId(store),
        error: selectors.getIsTicketAddingFailed(store),
        session: getSession(store)
    }),
    dispatch => ({
        addTicket: (ticket) => dispatch(add(ticket)),
        addFile: (file) => dispatch(addFile(file)),
        dismiss: () => dispatch(dismiss())
    })
)
export default class VisitorScreen extends Component {
    static navigationOptions = ({navigation}) => {
        switch(navigation.state.params.ticketType){
          case 'VISITOR':
              headerTitle = 'Посетитель'
              break;
          case 'CARD':
              headerTitle = 'Пропуск'
              break;
        }
        return ({
            title: headerTitle,
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.save()}>
                        <Icon name='check' color='#FFF' size={30}/>
                    </TouchableOpacity>
                </View>
            )
        })
    }


    componentWillMount() {
        const { ticketType } = this.props.navigation.state.params
        const { employeeId, companyId, session } = this.props
        switch(ticketType) {
          case 'VISITOR':
              ticketTypeId = VISITOR_TICKET_TYPE;
              break;
          case 'CARD':
              ticketTypeId = CARD_TICKET_TYPE;
              break;
        }
        const nowDate = new Date();
        const minDate = nowDate
        minDate.setMinutes(minDate.getMinutes() + 5 - minDate.getMinutes() % 5)

        if(ticketType == 'VISITOR' || ticketType == 'SERVICE'){
          ticketParking = null;
          ticketParkingType = null;
        }

        ticketHour = ((minDate.getHours()<10?'0':'') + minDate.getHours())
        ticketTime = ((minDate.getMinutes()<10?'0':'') + minDate.getMinutes())

        const ticket = {
            visitorFullName: '',
            actualCreationDate: nowDate,
            visitDate: minDate,
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: ticketTypeId,
            client: companyId,
            photo: null
        }

        this.setState({ticket: ticket,
           ticketType: ticketType, session: session})
    }

    componentDidMount() {
        headerButtonsHandler.save = this.save
    }

    componentWillReceiveProps(newProps) {
      const { added, error, fileAdded, fileId } = newProps
      const { goBack } = this.props.navigation

      if (added){
          Alert.alert( '', 'Заявка добавлена успешно',
          [{text: 'Закрыть', onPress: () => { goBack() }}])
          this.props.dismiss()
      }

      if (error) {
          Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
          [{text: 'Закрыть', onPress: () => { }}])
      }

      if (fileAdded){
          this.addFileId(fileId)
          Alert.alert( '', 'Файл добавлен успешно',
          [{text: 'Закрыть', onPress: () => { }}])
          this.props.dismiss()
      }
    }

    save = () => {
        const { ticket } = this.state
        const { ticketType } = this.props.navigation.state.params

        if(ticket.visitorFullName == ''){
          Alert.alert( 'Внимание', 'Не заполнены данные о посетителе',[{text: 'Закрыть', onPress: () => { }}])
        }else{
          if((ticket.visitorFullName.match(/ /g) || []).length != 2 && ticketType == 'VISITOR'){
            Alert.alert( 'Внимание', 'Заполните ФИО по формату "Фамилия Имя Отчество"',[{text: 'Закрыть', onPress: () => { }}])
          }else{
            if(ticketType == 'CARD' && !ticket.photo){
              Alert.alert( 'Внимание', 'Выберите фото',[{text: 'Закрыть', onPress: () => { }}])
            } else {
              this.props.addTicket(ticket)
            }
          }
        }

    }

    saveFile = (file) => {
        this.props.addFile(file)
    }

    addFileId = (fileId) => {
      const { ticket } = this.state
      ticket.photo = fileId
      this.setState({ticket})
    }

    updateVisitor = text => {
        const { ticket } = this.state
        ticket.visitorFullName = text
        this.setState({ticket})
    }

    updateMultipleEntry = check => {
      const { ticket } = this.state
      ticket.multipleEntry = check
      this.setState({ticket})
    }

    updateVisitDate = date => {
        const { ticket } = this.state
        ticket.visitDate = date
        this.setState({ticket})
    }

    render = () => {
        const { ticket,
           ticketType, session} = this.state
        const { isAdding, fileIsAdding } = this.props
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        return (
            <Loader message='Сохранение' isLoading={isAdding || fileIsAdding}>
                <VisitorTicketEditor
                    ticket={ticket}
                    updateVisitor={this.updateVisitor}
                    updateVisitDate={this.updateVisitDate}
                    updateMultipleEntry={this.updateMultipleEntry}
                    saveFile={this.saveFile}

                    ticketType={ticketType}
                />
            </Loader>
        )
    }
}
