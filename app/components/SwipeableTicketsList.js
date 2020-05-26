import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from 'react-native'
import { Button } from 'react-native-elements'
import { LargeList } from 'react-native-largelist'

import { Colors } from '../theme'
import TicketsListItem from './TicketsListItem'
import SwipeoutElement from './SwipeoutElement'


export default class TicketsList extends React.PureComponent {
    reloadData = () => this.list.reloadData()

    handleAction = (item) => this.props.handleAction(item)

    renderElement = (section, row) => {
        const item = this.props.items[row]
        return (
            <SwipeoutElement item={item} handleAction={this.handleAction} />
        )
    }

    renderCell = (section, row) => {
        const item = this.props.items[row]
        return (
            <TicketsListItem item={item} />
        )
    }

    render() {
        return (
            <LargeList
                style={{flex: 1, borderRadius: 5}}
                bounces={true}
                ref={list => this.list = list}
                numberOfRowsInSection={() => this.props.items.length}
                renderCell={this.renderCell}
                heightForCell={() => 121}
                renderRightWhenSwipeOut={this.renderElement}
                widthForRightWhenSwipeOut={() => 80}
                colorForSwipeOutBgColor={() => 'white'}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundColor
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
})
