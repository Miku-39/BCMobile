import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'


export default class SwipeoutElement extends React.PureComponent {
    handleAction = () => this.props.handleAction(this.props.item)

    render() {
      console.log('quack')
        const { item } = this.props
        return (
                <TouchableOpacity onPress={this.handleAction} style={{backgroundColor: '#8d47d3', margin: 1, height: 98, width: 78, justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginRight: 1}}>
                    <MaterialIcons name={item.status.id === '421575460000' ? 'arrow-back' : 'arrow-forward'} size={20} color={'white'} />
                    <Text style={{color: 'white'}}>{item.status.id === '421575460000' ? 'Убыл' : 'Прибыл'}</Text>
                </TouchableOpacity>
        )
    }
}
