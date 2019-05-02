import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableHighlight,
    Alert
} from 'react-native'
import { Button } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'

import TicketsListItem from '../components/TicketsListItem'
import { Images, Colors } from '../theme'


const extractKey = ({id}) => id
const status2colors = {
    null: 'gray',
    '12884953000': '#008000',//Принята
    '421575460000': '#214dde',//На территор...
    '421575453000': '#008000',//Выполнена
    '421575459000': '#d12424',//Отклонена
    '4285215000': '#fd9419',//Создана
    '2804833189000': '#d12424',//Повторная
    '4285216000': '#808080',//Закрыта
}

export default class TicketsList extends React.PureComponent {
    renderItem = ({item}) => {
              Text.defaultProps = Text.defaultProps || {};
              Text.defaultProps.allowFontScaling = true;
              return(
                <TicketsListItem item={item} />
              )

    }

    render() {
        return (
            <FlatList
                style={{flex: 1, backgroundColor: Colors.backgroundColor}}
                data={this.props.items}
                renderItem={this.renderItem}
                keyExtractor={extractKey} />

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
