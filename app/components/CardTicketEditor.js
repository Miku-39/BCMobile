import React, { Component } from 'react'
import { View,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  Image,
  LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import DatePicker from 'react-native-datepicker'
import ReactNativePickerModule from 'react-native-picker-module'
import { CheckBox } from 'react-native-elements'
import ImagePickerComponent from '../components/ImagePicker'
import DatePickerComponent from '../components/DatePicker'
import PickerComponent from '../components/PickerAlternate'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Colors } from '../theme'

export default class CardScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       visitDate: this.props.ticket.visitDate,
       image: null
     }
  }

  setVisible = (field) => {
    state = this.state
    state[field] = !state[field]
    if(field == 'isCommonAreas'){
      this.props.updateField(state[field], field);
    }
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
    }

    fields['fieldsVisible'] = fieldsVisible
    this.setState(fields);
  }

  updateFile = (uri) => {
    this.props.saveFile(uri)
    //this.setState({image: uri})
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    switch(this.props.ticketType){
      case 'CARD':
          label = 'На изготовление пропуска';
          break;
      case 'SERVICE':
          label = 'Сервисная';
          break;
      case 'ALTSERVICE':
          label = 'На дополнительное обслуживание';
          break;
      default:
          label = 'Сервисная';
          break;
    }
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraHeight={130}
              extraScrollHeight={130}>
              <View style={{
                flexDirection: 'column',
                marginLeft: 5,
                marginRight: 5}}>

                <View style={styles.fieldsContainer}>
                  <Text style={styles.field}>{label}</Text>
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
                </View>

                <View style={styles.fieldsContainer}>
                <Fumi
                    style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.visitorFullName ? Colors.accentColor : '#FFF'}]}
                    label={'ФИО посетителя *'}
                    iconClass={Icon}
                    iconName={'person'}
                    iconColor={Colors.textColor}
                    iconSize={20}
                    labelStyle={styles.fumiLabel}
                    inputStyle={styles.fumiInput}
                    onChangeText={(text) => {this.updateField(text, 'visitorFullName')}}/>
                <Fumi
                    style={styles.fumiStyle}
                    label={'Из какой компании'}
                    iconClass={Icon}
                    iconName={'person'}
                    iconColor={Colors.textColor}
                    iconSize={20}
                    labelStyle={styles.fumiLabel}
                    inputStyle={styles.fumiInput}
                    onChangeText={(text) => {this.updateField(text, 'companyName')}}/>
                </View>

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

              <ImagePickerComponent
                label='Файл'
                isHighlighted={this.props.fieldsHighlights.logo}
                onChoose={(file) => {this.props.saveFile(file, 'file')}}/>

            </View>
            </KeyboardAwareScrollView>
      </View>
    )
  }
}const styles = StyleSheet.create({
    fumiInput: {
      color: Colors.textColor,
      marginBottom: Platform.OS === 'android' ? 7 : 0
   },
   fumiStyle: {
     borderRadius: 20,
     backgroundColor: Colors.fieldsColor,
     borderWidth: 5,
     borderColor: '#FFF'
   },
   textInputStyle:{
    height: 160,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#FFF',
    backgroundColor : "#FFF",
    fontSize: 18,
    color: Colors.textColor,
    padding: 10,
    paddingTop: 10
  },
  field: {
    margin: 10,
    color: Colors.textColor,
    fontSize: 18,
    fontWeight: '500'
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
  fieldsContainer: {
    backgroundColor: Colors.fieldsColor,
    borderRadius: 20,
    marginBottom: 10
  }
})
