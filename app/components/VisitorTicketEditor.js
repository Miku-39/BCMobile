import React, { Component } from 'react'
import {  View,
          ScrollView,
          Text,
          TextInput,
          StyleSheet,
          TouchableOpacity,
          Platform,
          NativeModules,
          LayoutAnimation } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import { CheckBox } from 'react-native-elements'
import { Colors } from '../theme'
import DatePickerComponent from '../components/DatePicker'
import PickerComponent from '../components/PickerAlternate'

import ReactNativePickerModule from 'react-native-picker-module'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class VisitorTicketEditor extends Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       //selectedParking: this.props.initialParking,
       fieldsVisible: {
         parkingPlace: true,
         expirationDate: false,
       },
       expirationDate: null,
       //'additionalFieldsVisible': false,
       carFieldsVisible: this.props.ticketType == 'CAR',
       longTerm: false,
     }
  }

  setVisible = (field) => {
    state = this.state
    state[field] = !state[field]
    if(field == 'longTerm'){
      this.props.updateField(state[field], field);
    }
    LayoutAnimation.easeInEaseOut();
    this.setState(state)
  }

  updateField = (data, field) => {
    this.props.updateField(data, field);
    LayoutAnimation.easeInEaseOut();

    var fields = this.state
    fields[field] = data

    var fieldsVisible = {
      expirationDate: fields.longTerm
    }

    fields['fieldsVisible'] = fieldsVisible
    this.setState(fields);
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    //Text.defaultProps.allowFontScaling = true;
    const { ticketType } = this.props
    return (
        <View style={{ flexGrow: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={130}
            extraScrollHeight={130}>
                <View style={{
                  flexDirection: 'column',
                  marginLeft: 5,
                  marginRight: 5}}>

                  <View style={styles.fieldsContainer}>
                    <Text style={styles.field}>{ticketType == 'VISITOR' ? 'На посещение' : 'На въезд авто'}</Text>
                  </View>

                  <View style={styles.fieldsContainer}>
                      <DatePickerComponent
                        date={this.props.ticket.visitDate}
                        onUpdate={(date) => {this.updateField(date, 'visitDate')}}
                        label="Дата *"
                        placeholder="Выберите дату"/>
                      <CheckBox
                        title='Долгосрочная'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.longTerm}
                        checkedColor={Colors.textColor}
                        onPress={() => {this.setVisible('longTerm')}}/>
                      {this.state.longTerm &&
                      <DatePickerComponent
                        isHighlighted={this.props.fieldsHighlights.expirationDate}
                        date={this.props.ticket.expirationDate ? this.props.ticket.expirationDate : new Date()}
                        onUpdate={(date) => {this.updateField(date, 'expirationDate')}}
                        label="Действует до *"
                        placeholder="Выберите дату"
                        />
                      }
                      {this.props.session.isLesnaya &&
                      <PickerComponent
                          label="Здание"
                          removeEmptyField={true}
                          items={this.props.lesnayaDepartments}
                          onUpdate={(text) => {this.updateField(text, 'department')}}/>}
                  </View>

                  <View style={styles.fieldsContainer}>
                      <Fumi
                          style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.visitorFullName ? Colors.accentColor : '#FFF'}]}
                          label={ticketType == 'VISITOR' ? 'ФИО посетителя *' : 'ФИО посетителя'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'visitorFullName')}}/>
                      {ticketType == 'VISITOR' &&
                      <Fumi
                          style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.whoMeets ? Colors.accentColor : '#FFF'}]}
                          label={'ФИО встречающего'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'whoMeets')}}/>}
                  </View>

                  {this.props.ticketType == 'CAR' &&
                  <View style={styles.fieldsContainer}>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'Марка автомобиля'}
                          iconClass={Icon}
                          iconName={'directions-car'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'carModelText')}}/>
                      <Fumi
                          style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.carNumber ? Colors.accentColor : '#FFF'}]}
                          label={'Номер автомобиля *'}
                          iconClass={Icon}
                          iconName={'directions-car'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'carNumber')}}/>

                      <PickerComponent
                          label="Парковка"
                          items={this.props.carParkings}
                          onUpdate={(text) => {this.updateField(text, 'parking')}}/>
                 </View>}

                  <View style={styles.fieldsContainer}>
                    <TextInput
                      placeholder="Примечание"
                      underlineColorAndroid='transparent'
                      style={styles.textInputStyle}
                      multiline={true}
                      scrollEnabled={true}
                      onChangeText={(text) => {this.props.updateField(text, 'note')}}
                      />
                  </View>

                </View>
            </KeyboardAwareScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
   fieldsContainer: {
     backgroundColor: Colors.fieldsColor,
     borderRadius: 20,
     marginBottom: 10
   },
   fumiStyle: {
     borderRadius: 20,
     backgroundColor: Colors.fieldsColor,
     borderWidth: 5,
     borderColor: '#FFF'
   },
   fumiInput: {
     color: Colors.textColor,
     marginBottom: Platform.OS === 'android' ? 7 : 0
   },
   fumiLabel: {
     color: Colors.textColor
   },
   picker: {
     borderRadius: 20,
     marginTop: 5,
     width: 200,
     height: 40,
     alignSelf: 'center',
     alignItems: 'center',
     backgroundColor: Colors.buttonColor,
     borderWidth: 5,
     borderColor: '#FFF'
   },
   pickerLabel: {
     fontWeight: 'bold',
     color: Colors.textColor,
     fontSize: 16,
     alignSelf: 'center',
     textAlign: 'center'
   },
   pickerText:{
     fontSize: 18,
     alignSelf: 'center',
     margin: 8,
     color: Colors.textColor
    },
   checkboxContainer: {
     marginTop: 8,
     backgroundColor: Colors.fieldsColor,
     borderRadius: 10,
     borderWidth: 0
   },
   checkboxText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: Colors.textColor
   },
   textInputStyle:{
    height: 120,
    borderRadius: 20,
    fontSize: 18,
    color: Colors.textColor,
    padding: 10,
    borderWidth: 5,
    borderColor: '#FFF'
  },
  field: {
    margin: 10,
    color: Colors.textColor,
    fontSize: 18,
    fontWeight: '500'
  }
})
