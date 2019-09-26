import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Colors } from '../theme'

export default class DatePickerComponent extends React.Component {
  constructor(props) {
     super(props);
  }

  render() {
    const minDate = this.props.date ? new Date(this.props.date) : new Date()
    const maxDate = this.props.date ? new Date(this.props.date) : new Date()
    maxDate.setFullYear(minDate.getFullYear()+1)

    return (
      <View style={{margin: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.pickerLabel}>{this.props.label}</Text>
          <DatePicker
              style={{ alignSelf: 'center', height: 40, width: 210}}
              date={this.props.date}
              mode="date"
              format="YYYY-MM-DD"
              minDate={minDate}
              minuteInterval={5}
              locale="ru-RU"
              maxDate={maxDate}
              confirmBtnText="Подтвердить"
              cancelBtnText="Отмена"
              placeholder={this.props.placeholder}
              customStyles={{
                  dateIcon: {
                      width: 0
                  },
                  dateInput: {
                      borderRadius: this.props.isHighlighted ? 25 : 20,
                      height: this.props.isHighlighted ? 50 : 40,
                      width: this.props.isHighlighted ? 210 : 200,
                      borderWidth: 5,
                      borderColor: this.props.isHighlighted ? Colors.accentColor : Colors.buttonColor,
                      backgroundColor: Colors.buttonColor
                  }
              }}
              onDateChange={this.props.onUpdate}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
   pickerLabel: {
     fontWeight: 'bold',
     color: Colors.textColor,
     fontSize: 16,
     alignSelf: 'center',
     textAlign: 'center',
     margin: 5
   }
})
