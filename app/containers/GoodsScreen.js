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

import GoodsTicketEditor from '../components/GoodsTicketEditor'
import Loader from '../components/Loader'
import * as selectors from '../middleware/redux/selectors'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

import { getSession } from '../middleware/redux/selectors'
import { storeCredentials, loadCredentials } from '../middleware/utils/AsyncStorage'

const NEW_TICKET_STATUS_ID = '4285215000';
const ACCEPTED_TICKET_STATUS_ID = '12884953000';
const GOODS_TICKET_TYPE = '393629549000';

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
export default class GoodsScreen extends Component {
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
        const goodsTicketTypes = { "GOODS_IN": "393629549000",
                                   "GOODS_OUT": "421534163000" }

        const nowDate = new Date();
        var ticket = {
            visitorFullName: '',
            carModelText: '',
            carNumber: '',
            actualCreationDate: nowDate,
            visitDate: nowDate,
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: goodsTicketTypes[ticketType],
            client: companyId,
            nonstandardCarNumber: true,
            materialValuesData: '',
            longTerm: false
        }


        if(session.isLesnaya){
          ticket.department = session.department
          ticket.status = ticket.department == '4006045944000' ? NEW_TICKET_STATUS_ID : ACCEPTED_TICKET_STATUS_ID
          ticket.manager = ticket.department == '4006045944000' ? '3959752571000' : null //если ЦБ, то Татаринова
        }

        const fieldsHighlights = {}

        this.setState({ticket: ticket,
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
          ticket.status = ticket.department == '4006045944000' ? NEW_TICKET_STATUS_ID : ACCEPTED_TICKET_STATUS_ID
          ticket.manager = ticket.department == '4006045944000' ? '3959752571000' : null //если ЦБ, то Татаринова
        }

        var fieldsHighlights = {
          materialValuesData: !ticket.materialValuesData,
          expirationDate: ticket.longTerm && !ticket.expirationDate
          //carNumber: !ticket.carNumber
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

        LayoutAnimation.easeInEaseOut();
        this.setState({'fieldsHighlights': fieldsHighlights})
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


    render = () => {
        const { ticket, ticketType, session} = this.state
        const { isAdding } = this.props

        Text.defaultProps = Text.defaultProps || {};

        const lesnayaDepartments = [
          { name: "БЦ Лесная 43", id: "3959751378000" },
          { name: "БЦ Цветной Бульвар", id: "4006045944000" }
        ]

        if(session.department == "4006045944000")
          lesnayaDepartments[0], lesnayaDepartments[1] = lesnayaDepartments[1], lesnayaDepartments[0]

        //Text.defaultProps.allowFontScaling = false;
        return (
            <Loader message='Сохранение' isLoading={isAdding}>
                <GoodsTicketEditor
                    ticket={ticket}
                    updateLongTerm={this.updateLongTerm}
                    updateField={this.updateField}
                    saveFile={this.saveFile}
                    fieldsHighlights={this.state.fieldsHighlights}
                    ticketType={ticketType}
                    session={session}
                    lesnayaDepartments={lesnayaDepartments}

                    services={session.services}
                />
            </Loader>
        )
    }
}
