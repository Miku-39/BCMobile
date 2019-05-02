import React, { Component } from 'react'
import { View, Alert, TouchableOpacity, Keyboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'

import TicketsList from '../components/TicketsList'
import { Metrics } from '../theme'
import { fetch } from '../middleware/redux/actions/Tickets'
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
    { fetch }
)
export default class TicketsScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Заявки',
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.refresh()}>
                        <MaterialIcons name='autorenew' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 14, marginRight: 10}} onPress={() => headerButtonsHandler.search()}>
                        <MaterialIcons name='search' size={24} color='white' />
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
        const { items } = nextProps.tickets
        this.setState({ items: items })
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
        Keyboard.dismiss()
    }

    _handleSearchTextChanged = (text) => {
        const filter = text.toLowerCase()
        const { items } = this.props.tickets
        let data

        if (filter) {
            data = items.filter(item => item.visitorFullName && item.visitorFullName.toLowerCase().includes(filter))
        } else {
            data = items
        }
        this.setState({items: data})
    }

    render() {
        const { items, searchBarIsShown } = this.state
        const { isFetching, fetched } = this.props.tickets

        return (
            <View style={{flex: 1}}>
                {
                    searchBarIsShown &&
                    <SearchBar
                        lightTheme
                        clearIcon={{color: '#53565A', name: 'close'}}
                        inputStyle={{backgroundColor: 'white', fontSize: 20}}
                        containerStyle={{backgroundColor: '#8d47d3', height: Metrics.navBarHeight, width: '100%', marginTop: -1}}
                        onChangeText={this._handleSearchTextChanged}
                        onClearText={this._handleHideSearchBarClick}
                        placeholder='Поиск...'
                    />
                }

                <Loader message='Обновление заявок' isLoading={isFetching}>
                    <TicketsList items={items} />
                </Loader>
            </View>
        )
    }
}
