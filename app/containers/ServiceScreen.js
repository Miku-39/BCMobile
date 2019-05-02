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

import ServiceTicketEditor from '../components/ServiceTicketEditor'
import Loader from '../components/Loader'
import * as selectors from '../middleware/redux/selectors'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

import { getSession } from '../middleware/redux/selectors'
import { storeCredentials, loadCredentials } from '../middleware/utils/AsyncStorage'

const NEW_TICKET_STATUS_ID = '2237224236000';

const SERVICE_TICKET_TYPE = '3724900074000';

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

export default class ServiceScreen extends Component {
    static navigationOptions = ({navigation}) => {
      switch(navigation.state.params.ticketType){
        case 'SERVICE':
            headerTitle = 'Обслуживание'
            break;
        case 'ALT_SERVICE':
            headerTitle = 'Доп. Обслуживание'
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
        const { showCarFields, showGoodsFields, ticketType } = this.props.navigation.state.params
        const { employeeId, companyId, session } = this.props

        const ticket = {
            actualCreationDate: new Date(),
            visitDate: new Date(),
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: SERVICE_TICKET_TYPE,
            client: companyId,
            isCommonAreas: false,
            WhatHappened: '',
            room: '',
            service: session.services[0].id,
            isAdditionalService: ticketType == 'ALT_SERVICE'
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
        if(ticket.WhatHappened == ''){
          Alert.alert( 'Внимание', 'Не заполнено поле "Что сделать"',[{text: 'Закрыть', onPress: () => { }}])
        }else{
        if(!ticket.isCommonAreas && ticket.room == ''){
          Alert.alert( 'Внимание', 'Не заполнены данные о помещении',[{text: 'Закрыть', onPress: () => { }}])
        }else{
          this.props.addTicket(ticket)
        }}

    }

    saveFile = (file) => {
        this.props.addFile(file)
    }

    addFileId = (fileId) => {
      const { ticket } = this.state
      ticket.file = fileId
      this.setState({ticket})
    }

    updateService = (name, id) => {
        const { ticket } = this.state
        ticket.service = id
        this.setState({ticket})
    }
    updateMOP = check => {
        const { ticket } = this.state
        ticket.room = check ? null : ticket.room
        ticket.isCommonAreas = check
        this.setState({ticket})
    }
    updateRoom = room => {
      const { ticket } = this.state
      ticket.room = room
      this.setState({ticket})
    }

    updateMaterialSupplier = text => {
      const { ticket } = this.state
      ticket.materialSupplier = text
      this.setState({ticket})
    }

    updateWhatHappened = text => {
      const { ticket } = this.state
      ticket.WhatHappened = text
      this.setState({ticket})
    }

    render = () => {
        const { ticket, ticketType, session} = this.state
        const { isAdding, fileIsAdding } = this.props
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        return (
            <Loader message='Сохранение' isLoading={isAdding || fileIsAdding}>
                <ServiceTicketEditor
                    ticket={ticket}
                    updateService={this.updateService}
                    updateMOP={this.updateMOP}
                    updateRoom={this.updateRoom}
                    updateWhatHappened={this.updateWhatHappened}
                    updateMaterialSupplier={this.updateMaterialSupplier}
                    saveFile={this.saveFile}
                    ticketType={ticketType}

                    initialService={session.services[0].name}
                    services={session.services}

                />
            </Loader>
        )
    }
}
