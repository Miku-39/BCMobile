import React, { Component } from 'react'
import { View,
  DatePickerAndroid,
  DatePickerIOS,
  Alert,
  TouchableOpacity,
  Text,
  NativeModules,
  LayoutAnimation,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CardTicketEditor from '../components/CardTicketEditor'
import Loader from '../components/Loader'
import * as selectors from '../middleware/redux/selectors'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

import { getSession } from '../middleware/redux/selectors'
import { storeCredentials, loadCredentials } from '../middleware/utils/AsyncStorage'
const OPEN_TICKET_STATUS_ID = '2237224236000';

const CARD_TICKET_TYPE = '437149164000';
const SERVICE_TICKET_TYPE = '3724900074000'

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
export default class CardScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Новая заявка',
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.save()}>
                        <Icon name='check' color='#FFF' size={30}/>
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: (<Icon name='chevron-left' color='#FFF' size={40} onPress={ () => { navigation.goBack() } }/> )

        })
    }


    componentWillMount() {
        const { ticketType } = this.props.navigation.state.params
        const { employeeId, companyId, session } = this.props
        switch(ticketType) {
          case 'SERVICE':
              ticketTypeId = SERVICE_TICKET_TYPE;
              break;
          case 'ALTSERVICE':
              ticketTypeId = SERVICE_TICKET_TYPE;
              break;
          case 'CARD':
              ticketTypeId = CARD_TICKET_TYPE;
              break;
        }

        const ticket = {
            visitorFullName: '',
            actualCreationDate: new Date(),
            author: employeeId,
            visitDate: new Date(),
            status: OPEN_TICKET_STATUS_ID,
            type: ticketTypeId,
            client: companyId,
            passType: ticketType == 'CARD' ? '2194469501000' : null,
            isAdditionalService: ticketType == 'ALTSERVICE' ? true : null,
            photo: null,
            file: null
        }

        this.setState({ticket: ticket,
           ticketType: ticketType, session: session, fieldsHighlights: {}})
    }

    componentDidMount() {
        headerButtonsHandler.save = this.save
    }

    componentWillReceiveProps(newProps) {
      const { added, error, fileAdded, fileId } = newProps
      const { goBack } = this.props.navigation

      if (added){
          Alert.alert( 'Заявка добавлена успешно', '',
          [{text: 'Закрыть', onPress: () => { goBack() }}])
          this.props.dismiss()
      }

      if (error) {
          console.log(error)
          Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
          [{text: 'Закрыть', onPress: () => { }}])
      }

      if (fileAdded){
          this.addFileId(fileId, this.file)
          Alert.alert( 'Файл добавлен успешно')
      }
    }

    save = () => {
        const { ticket } = this.state
        const { ticketType } = this.props.navigation.state.params

        var fieldsHighlights = {
          visitorFullName: (ticketType == 'CARD' && !ticket.visitorFullName),
          expirationDate: (ticket.longterm && !ticket.expirationDate)
        }

        Keyboard.dismiss()
        var passed = true;
        for (var i in fieldsHighlights) {
            if (fieldsHighlights[i] === true) {
                passed = false;
                break;
            }}

        console.log(ticket)
        if(passed){
          this.props.addTicket(ticket)
        }else{
          Alert.alert('Не заполнены обязательные поля')
        }

        LayoutAnimation.easeInEaseOut();
        this.setState({'fieldsHighlights': fieldsHighlights})

    }

    saveFile = (file, name) => {
        this.file = name
        this.props.addFile(file)
    }

    addFileId = (fileId, name) => {
      const { ticket, ticketType } = this.state
      switch(ticketType) {
        case 'SERVICE':
            ticket.file= fileId;
            break;
        case 'ALTSERVICE':
            ticket.file = fileId;
            break;
        case 'CARD':
            ticket[name] = fileId;
            break;
      }
      this.setState({ticket})
    }

    updateField = (data, field) => {
      const { ticket } = this.state
      ticket[field] = data == '' ? null : data
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
                <CardTicketEditor
                    ticket={ticket}
                    updateField={this.updateField}
                    saveFile={this.saveFile}
                    fieldsHighlights={this.state.fieldsHighlights}
                    ticketType={ticketType}
                    services={session.services}
                />
            </Loader>
        )
    }
}
