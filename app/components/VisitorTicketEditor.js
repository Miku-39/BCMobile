import React, { Component } from 'react'
import { View, ScrollView, Text, StyleSheet, Picker, TouchableOpacity, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import DatePicker from 'react-native-datepicker'
import ReactNativePickerModule from 'react-native-picker-module'
import { CheckBox } from 'react-native-elements'
import ImagePickerComponent from '../components/ImagePicker'

import { Images, Colors } from '../theme'

export default class VisitorScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       visitDate: this.props.ticket.visitDate,
       multipleEntry: false,
       image: null
     }
  }

  updateMultipleEntry = () =>{
    this.setState({multipleEntry: !this.state.multipleEntry})
    this.props.updateMultipleEntry(!this.state.multipleEntry)
  }
  updateImage = (uri) => {
    this.props.saveFile(uri)
    this.setState({image: uri})
  }

  render () {
    const minDate = new Date()
    const maxDate = new Date()

    minDate.setFullYear(minDate.getFullYear()-1)
    maxDate.setFullYear(minDate.getFullYear()+2)
    pickerFormat = "YYYY-MM-DD"
    pickerMode = "date"
    androidMargin = Platform.OS === 'android' ? 7 : 0
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView>
                  <Fumi
                      label={'ФИО посетителя'}
                      iconClass={Icon}
                      iconName={'person'}
                      iconColor={'#53565A'}
                      iconSize={20}
                      inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                      onChangeText={this.props.updateVisitor}
                  />

                {this.props.ticketType == 'VISITOR' &&
                <View style={{marginTop: 10}}>
                    <Text style={styles.pickerLabel}>Дата посещения</Text>

                    <DatePicker
                        style={{width: 200, alignSelf: 'center', marginTop: 5}}
                        date={this.props.ticket.visitDate}
                        mode={pickerMode}
                        placeholder="Выберите дату"
                        format={pickerFormat}
                        minDate={minDate}
                        minuteInterval={5}
                        locale="ru-RU"
                        maxDate={maxDate}
                        confirmBtnText="Подтвердить"
                        cancelBtnText="Отмена"
                        placeholder='Выберите дату посещения'
                        customStyles={{
                            dateIcon: {
                                width: 0
                            },
                            dateInput: {
                                borderRadius: 20,
                                borderWidth: 0,
                                backgroundColor: '#C9C8C7'
                            }
                        }}
                        onDateChange={this.props.updateVisitDate}
                    />
                </View>
              }
              { this.props.ticketType == 'CARD' &&
                  <ImagePickerComponent
                    onChoose={this.updateImage}/>
              }
            </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
   text: {
      fontSize: 30,
      alignSelf: 'center',
      color: 'red'
   },
   pickerLabel: {
     fontWeight: 'bold',
     color: '#53565A',
     fontSize: 16,
     alignSelf: 'center',
     textAlign: 'center'
   },
   checkboxContainer: {
     marginTop: 10,
     backgroundColor: '#FFF',
     borderRadius: 10,
     borderWidth: 0
   },
   checkboxText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#53565A'
   }
})
