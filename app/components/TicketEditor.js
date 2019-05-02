import React, { Component } from 'react'
import {  View,
          ScrollView,
          Text,
          StyleSheet,
          Picker,
          TouchableOpacity,
          Platform,
          NativeModules,
          LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import DatePicker from 'react-native-datepicker'
import ReactNativePickerModule from 'react-native-picker-module'
import { CheckBox } from 'react-native-elements'

import { Images, Colors } from '../theme'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class TicketScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       selectedParking: this.props.initialParking,
       visitDate: this.props.ticket.visitDate,
       lift: false,
       multipleEntry: false
     }
  }

  updateLift = () =>{
    LayoutAnimation.spring();
    this.setState({lift: !this.state.lift})
    this.props.updateLift(!this.state.lift)
  }

  render () {
    const minDate = new Date()
    const maxDate = new Date()
    const parkings = this.props.carParkings;
    parkingsByIndex = parkings.map(parking => {return parking.name})
    idByIndex = parkings.map(parking => {return parking.id})
    minDate.setFullYear(minDate.getFullYear()-1)
    maxDate.setFullYear(minDate.getFullYear()+2)
    pickerFormat = this.state.selectedParking == 'Гостевая' ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"
    pickerMode = this.state.selectedParking == 'Гостевая' ? "datetime" : "date"
    androidMargin = Platform.OS === 'android' ? 7 : 0
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView>
              <View style={{
               backgroundColor: '#FFF',
               borderRadius: 10,
               flexDirection: 'column'}}>
                   <Fumi
                       label={'ФИО посетителя'}
                       iconClass={Icon}
                       iconName={'person'}
                       iconColor={'#53565A'}
                       iconSize={20}
                       inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                       onChangeText={this.props.updateVisitor}
                    />
                    <Fumi
                        label={'Марка автомобиля'}
                        iconClass={Icon}
                        iconName={'directions-car'}
                        iconColor={'#53565A'}
                        iconSize={20}
                        inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                        onChangeText={this.props.updateCarModel}
                    />
                    <Fumi
                        label={'Номер автомобиля'}
                        iconClass={Icon}
                        iconName={'directions-car'}
                        iconColor={'#53565A'}
                        iconSize={20}
                        inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                        onChangeText={this.props.updateCarNumber}
                    />

                  { (this.state.selectedParking != 'Гостевая' && this.props.ticketType == 'CAR' && this.state.selectedParking != 'Курьерская') &&
                    <Fumi
                        label={'Место на парковке'}
                        iconClass={Icon}
                        iconName={'directions-car'}
                        iconColor={'#53565A'}
                        iconSize={20}
                        inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                        onChangeText={this.props.updateParkingPlace}
                    />
                  }

                  {this.props.ticketType != 'CAR' &&
                  <View>
                    <Fumi
                        label={'Данные о грузе'}
                        iconClass={Icon}
                        iconName={'receipt'}
                        iconColor={'#53565A'}
                        iconSize={20}
                        inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                        onChangeText={this.props.updateGoods}
                    />
                  </View>
                }
              </View>

                    {
                      Platform.OS === 'android' &&
                      <View style={{marginTop: 10}}>
                      <Text style={styles.pickerLabel}>Парковка</Text>
                      <View style={styles.picker}>
                      <Picker
                          selectedValue={this.state.selectedParking}
                          style={{height: 40, width: 180}}
                          onValueChange={(itemValue, itemIndex) =>
                          {
                          this.props.updateParking(itemValue, idByIndex[itemIndex]);
                          LayoutAnimation.spring();
                          this.setState({selectedParking: itemValue})
                          }
                          }>
                          {parkings.map(parking => {return <Picker.Item label={parking.name} value={parking.name}/>})}
                      </Picker>
                      </View>
                      </View>
                    }

                    {
                        Platform.OS === 'ios' &&
                        <View style={{marginTop: 10}}>
                        <Text style={styles.pickerLabel}>Парковка</Text>
                          <ReactNativePickerModule
                                          pickerRef={e => pickerRef = e}
                                          value={this.state.selectedValue}
                                          title='Парковка'
                                          cancelButton='Отмена'
                                          confirmButton='Выбрать'
                                          items={parkings.map(parking => {return parking.name})}
                                          onValueChange={(value) => {
                                               this.props.updateParking(parkingsByIndex[value], idByIndex[value]);
                                               LayoutAnimation.spring();
                                               this.setState({selectedValue: value })
                                               this.setState({selectedParking: parkingsByIndex[value]})
                                          }}/>

                          <TouchableOpacity onPress={() => {pickerRef.show()}} style={styles.picker}>
                            <Text style={styles.pickerText}>{this.state.selectedParking}</Text>
                          </TouchableOpacity>

                        </View>
                      }

                <View style={{marginTop: 10}}>
                    <Text style={styles.pickerLabel}>{this.state.selectedParking == 'Гостевая' ? 'Дата и время посещения' : 'Дата посещения'}</Text>

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
   picker: {
     borderRadius: 20,
     marginTop: 5,
     width: 200,
     height: 40,
     alignSelf: 'center',
     alignItems: 'center',
     backgroundColor: '#C9C8C7'
   },
   pickerLabel: {
     fontWeight: 'bold',
     color: '#53565A',
     fontSize: 16,
     alignSelf: 'center',
     textAlign: 'center'
   },
   pickerText:{
     fontSize: 18,
     alignSelf: 'center',
     margin: 8,
     color: '#53565A'
    },
   checkboxContainer: {
     marginTop: 8,
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
