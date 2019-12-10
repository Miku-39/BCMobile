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

import ServiceTicketEditor from '../components/ServiceTicketEditor'
import Loader from '../components/Loader'
import * as selectors from '../middleware/redux/selectors'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

import { getSession } from '../middleware/redux/selectors'
const NEW_TICKET_STATUS_ID = '4285215000';
const ACCEPTED_TICKET_STATUS_ID = '12884953000';

const CARD_TICKET_TYPE = '437149164000';
const SERVICE_TICKET_TYPE = '3724900074000'
const headerButtonsHandler = { save: () => null }


const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

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
        session: selectors.getSession(store)
    }),
    dispatch => ({
        addTicket: (ticket) => dispatch(add(ticket)),
        addFile: (file) => dispatch(addFile(file)),
        dismiss: () => dispatch(dismiss())
    })
)
export default class ServiceScreen extends Component {
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
          case 'CARD':
              ticketTypeId = CARD_TICKET_TYPE;
              break;
        }

        var ticket = {
            actualCreationDate: new Date(),
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: ticketTypeId,
            client: companyId,
            photo: null
        }

        if(session.isLesnaya){
          ticket.department = session.department
          ticket.asignee = '4051732437000' //Альфаком
          //ticket.manager = ticket.department == '3959751378000' ? '3959752547000' : '3959752571000' //если Лесная, то Зиновьев
          ticket.observersText = ticket.department == '3959751378000' ? '3959752576000' : null //если Лесная, то Курандикова
          ticket.status = ticket.department == '3959751378000' ? ACCEPTED_TICKET_STATUS_ID : ticket.status
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
          Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
          [{text: 'Закрыть', onPress: () => { }}])
      }

      if (fileAdded){
          this.updateField(fileId, 'file')
          Alert.alert( 'Файл добавлен успешно')
      }
    }

    save = () => {
        const { ticket } = this.state
        const { ticketType } = this.props.navigation.state.params
        const { session } = this.props

        if(session.isLesnaya){
          //ticket.manager = ticket.department == '3959751378000' ? '3959752547000' : '3959752571000' //если Лесная, то Зиновьев
          ticket.observersText = ticket.department == '3959751378000' ? '3959752576000' : null //если Лесная, то Курандикова
        }


        var fieldsHighlights = {
          whatHappened: !ticket.whatHappened
        }

        Keyboard.dismiss()
        var passed = true;
        for (var i in fieldsHighlights) {
            if (fieldsHighlights[i] === true) {
                passed = false;
                break;
            }}

        if(passed){
          this.props.addTicket(ticket)
        }else{
          Alert.alert('Заполните обязательные поля')
        }

        LayoutAnimation.easeInEaseOut();
        this.setState({'fieldsHighlights': fieldsHighlights})

    }

    saveFile = (file) => {
        this.props.addFile(file)
    }

    addFileId = (fileId) => {
      const { ticket } = this.state
      ticket.photo = fileId
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

        const lesnayaDepartments = [
          { name: "БЦ Лесная 43", id: "3959751378000" },
          { name: "БЦ Цветной Бульвар", id: "4006045944000" }
        ]

        if(session.department == "4006045944000")
          lesnayaDepartments[0], lesnayaDepartments[1] = lesnayaDepartments[1], lesnayaDepartments[0]
        //Text.defaultProps.allowFontScaling = false;
        return (
            <Loader message='Сохранение' isLoading={isAdding || fileIsAdding}>
                <ServiceTicketEditor
                    ticket={ticket}
                    updateField={this.updateField}
                    saveFile={this.saveFile}
                    fieldsHighlights={this.state.fieldsHighlights}
                    ticketType={ticketType}
                    session={session}
                    lesnayaDepartments={lesnayaDepartments}
                />
            </Loader>
        )
    }
}
