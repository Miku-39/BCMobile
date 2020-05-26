import React, { Component } from 'react'
import { View,
  Alert,
  TouchableOpacity,
  Text,
  NativeModules,
  LayoutAnimation,
  Keyboard
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
const ACCEPTED_TICKET_STATUS_ID = '12884953000';
const VISITOR_TICKET_TYPE = '393629542000';
const CAR_TICKET_TYPE = '393629546000';

const headerButtonsHandler = { save: () => null }

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

@connect(
    store => ({
        employeeId: selectors.getEmployeeId(store),
        companyId: selectors.getCompanyId(store),
        isAdding: selectors.getIsTicketAdding(store),
        added: selectors.getIsTicketAdded(store),
        error: selectors.getIsTicketAddingFailed(store),
        session: selectors.getSession(store)
    }),
    dispatch => ({
        addTicket: (ticket) => dispatch(add(ticket)),
        addFile: (file) => dispatch(addFile(file)),
        dismiss: () => dispatch(dismiss())
    })
)
export default class VisitorScreen extends Component {
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
        const { showCarFields, showGoodsFields, ticketType } = this.props.navigation.state.params
        const { employeeId, companyId, session } = this.props
        const nowDate = new Date();
        var ticket = {
            visitorFullName: '',
            carModelText: '',
            carNumber: '',
            actualCreationDate: nowDate,
            visitDate: nowDate,
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: ticketType == 'VISITOR' ? VISITOR_TICKET_TYPE : CAR_TICKET_TYPE,
            client: companyId,
            nonstandardCarNumber: true,
            longTerm: false,
            department: session.isLesnaya ? session.department : null
        }

        if(session.isLesnaya){
          ticket.department = session.department
          if(ticketType == 'VISITOR'){
            ticket.status = ACCEPTED_TICKET_STATUS_ID
          }
          if(ticketType == 'CAR'){
            ticket.manager = ticket.department == '3959751378000' ? '3959752547000' : '3959752571000' //если Лесная, то Зиновьев
            ticket.observersText = ticket.department == '3959751378000' ? '3959752576000' : null //если Лесная, то Курандикова
          }
        }

        const fieldsHighlights = {}

        this.setState({ticket: ticket, showCarFields: showCarFields,
           ticketType: ticketType, session: session, fieldsHighlights: fieldsHighlights})
    }

    componentDidMount() {
        headerButtonsHandler.save = this.save
    }

    componentWillReceiveProps(newProps) {
        const { added, error } = newProps
        const { goBack } = this.props.navigation

        if (added){
            Alert.alert( '', 'Добавлено успешно',
            [
                {text: 'Закрыть', onPress: () => { goBack() }}
            ])
            this.props.dismiss()
        }

        if (error) {
            Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
            [
                {text: 'Закрыть', onPress: () => { }}
            ])
        }
    }

    save = () => {
        const { ticket } = this.state
        const { ticketType } = this.props.navigation.state.params
        const { session } = this.props

        if(session.isLesnaya){
          if(ticketType == 'CAR'){
            ticket.manager = ticket.department == '3959751378000' ? '3959752547000' : '3959752571000' //если Лесная, то Зиновьев
            ticket.observersText = ticket.department == '3959751378000' ? '3959752576000' : null //если Лесная, то Курандикова
          }
        }

        var fieldsHighlights = {
          expirationDate: (ticket.longTerm && !ticket.expirationDate),
          visitorFullName: !ticket.visitorFullName && ticketType == 'VISITOR',
          carNumber: !ticket.carNumber && ticketType =='CAR'
        }

        var passed = true;
        for (var i in fieldsHighlights) {
            if (fieldsHighlights[i] === true) {
                passed = false;
                break;
            }}

        Keyboard.dismiss()

        if(passed){
          this.props.addTicket(ticket)
        }else{
          Alert.alert('Не заполнены обязательные поля')
        }
        this.setState({'fieldsHighlights': fieldsHighlights})
        LayoutAnimation.easeInEaseOut();
    }

    saveFile = (file) => {
        this.props.addFile(file)
    }

    updateField = (data, field) => {
      const { ticket } = this.state
      if(field == 'longTerm'){
        ticket.expirationDate = null
      }
      ticket[field] = data === '' ? null : data
      this.setState({ticket})
    }

    updateLongTerm = check => {
        const { ticket } = this.state
        ticket.longTerm = check
        this.setState({ticket})
    }


    render = () => {
        const { ticket, ticketType, session } = this.state
        const { isAdding } = this.props
        const times = [
          { name: "8:00-18:00",  id: "4067716405000" },
          { name: "6:00-8:00",   id: "4101841236000" },
          { name: "8:00-10:00",  id: "4030991143000" },
          { name: "10:00-12:00", id: "4030991147000" },
          { name: "12:00-14:00", id: "4030991151000" },
          { name: "14:00-16:00", id: "4030991158000" },
          { name: "16:00-18:00", id: "4030991161000" },
          { name: "18:00-20:00", id: "4101841258000" },
          { name: "20:00-6:00",  id: "4067716412000" }
        ]

        const lesnayaDepartments = [
          { name: "БЦ Лесная 43", id: "3959751378000" },
          { name: "БЦ Цветной Бульвар", id: "4006045944000" }
        ]

        if(session.department == "4006045944000")
          lesnayaDepartments[0], lesnayaDepartments[1] = lesnayaDepartments[1], lesnayaDepartments[0]

        Text.defaultProps = Text.defaultProps || {};
        //Text.defaultProps.allowFontScaling = false;
        carParkings = session.carParkings.sort((first, second) => {
          return first.name > second.name ? 1 : -1
        })
        return (
            <Loader message='Сохранение' isLoading={isAdding}>
                <VisitorTicketEditor
                    ticket={ticket}
                    session={session}
                    updateLongTerm={this.updateLongTerm}
                    updateField={this.updateField}
                    saveFile={this.saveFile}
                    fieldsHighlights={this.state.fieldsHighlights}
                    ticketType={ticketType}

                    times={times}
                    carParkings={carParkings}
                    services={session.services}
                    lesnayaDepartments={lesnayaDepartments}
                />
            </Loader>
        )
    }
}
