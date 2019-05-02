import React, { Component } from 'react'
import { View, StatusBar, Alert, TouchableOpacity, Keyboard, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'

import TicketsList from '../components/SwipeableTicketsList'
import { Metrics } from '../theme'
import { fetch } from '../middleware/redux/actions/Tickets'
import { update, dismiss } from '../middleware/redux/actions/Ticket'
import { getTickets, getTicket } from '../middleware/redux/selectors'
import Loader from '../components/Loader'

const headerButtonsHandler = {
    refresh: () => null,
    search: () => null
}
const CAME_STATUS_ID = '421575460000'
const WENT_STATUS_ID = '421575453000'

@connect(
    store => ({
        tickets: getTickets(store),
        ticket: getTicket(store)
    }),
    { fetch, update, dismiss }
)
export default class CheckpointScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'КПП',
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.refresh()}>
                        <MaterialIcons name='autorenew' size={28} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 14, marginRight: 10}} onPress={() => headerButtonsHandler.search()}>
                        <MaterialIcons name='search' size={28} color='white' />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    state = {
        items: [],
        searchBarIsShown: false
    }

    componentDidMount () {
        headerButtonsHandler.search = this._handleShowSearchBarClick
        headerButtonsHandler.refresh = this._handleRefreshClick
        this.props.fetch()
    }

    componentWillReceiveProps (nextProps) {
        const { items, fetched } = nextProps.tickets
        this.setState({ items: items.slice(0, 50) })

        if (fetched)
            this.list.reloadData()

        const { updated } = nextProps.ticket
        if (updated) {
            Alert.alert( 'Внимание', 'Статус заявки успешно изменен', [
                {text: 'Закрыть', onPress: () => {
                    this.props.dismiss()
                    this.props.fetch()
                }}
            ])
        }
    }

    _handleRefreshClick = () => {
        this._handleHideSearchBarClick()
        this.props.fetch()
    }

    _handleShowSearchBarClick = () => {
        const { searchBarIsShown } = this.state
        if (!searchBarIsShown)
          this.setState({searchBarIsShown: true})
    }

    _handleHideSearchBarClick = () => {
        this.setState({searchBarIsShown: false})
        this.handleSearch()
        Keyboard.dismiss()
    }

    handleSubmitEditing = event => this.handleSearch(event.nativeEvent.text)

    handleSearch = text => {
        const { items } = this.props.tickets

        let data
        if (text) {
            data = items.filter(item => item.carNumber && item.carNumber.toLowerCase().includes(text.toLowerCase())
            || item.carModelText && item.carModelText.toLowerCase().includes(text.toLowerCase())
            || item.visitorFullName && item.visitorFullName.toLowerCase().includes(text.toLowerCase())
            || (item.number && item.number + '').toLowerCase().includes(text.toLowerCase())
            || item.type.shortName && item.type.shortName.toLowerCase().includes(text.toLowerCase()))
        } else {
            data = items.slice(0, 50)
        }

        this.setState({items: data}, this.list.reloadData)
    }

    handleChangeStatus = (item) => {
        if (item.status.id === '421575460000')
            item.status = { id: WENT_STATUS_ID }
        else item.status = { id: CAME_STATUS_ID }

        this.props.update(item)
    }

    render() {
        const { items, searchBarIsShown } = this.state
        const { isFetching } = this.props.tickets

        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle='light-content' />
                {
                    searchBarIsShown &&
                    <SearchBar
                        lightTheme
                        clearIcon={{color: '#86939e', name: 'close'}}
                        inputStyle={{backgroundColor: 'white', fontSize: 20}}
                        containerStyle={{backgroundColor: '#627ab4', height: Metrics.navBarHeight, width: '100%', marginTop: -1}}
                        onSubmitEditing={this.handleSubmitEditing}
                        onClearText={this._handleHideSearchBarClick}
                        keyboardType='default'
                        placeholder='Поиск...'
                        returnKeyType='done'
                    />
                }

                <Loader message='Обновление заявок' isLoading={isFetching}>
                    <TicketsList
                        ref={list => this.list = list}
                        items={items}
                        handleAction={this.handleChangeStatus} />
                </Loader>
            </View>
        )
    }
}
