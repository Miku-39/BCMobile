import { Picker } from 'react-native-woodpicker'
import React from 'react';
import {  View,
          StyleSheet,
          Text,
          NativeModules } from 'react-native';
import { Colors } from '../theme'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class PickerComponent extends React.Component {
  constructor(props) {
     super(props);
  }

  state = {
    pickedData: null
  };

  data = this.props.removeEmptyField ? this.props.items.map(item => {return {label: item.name, value: item.id}}) : [{label: 'Не выбрано', value: ''}].concat(this.props.items.map(item => {return {label: item.name, value: item.id}}))
  handlePicker = data => {
    LayoutAnimation.easeInEaseOut()
    this.setState({ pickedData: data });
  };

  render() {
    return (
      <View style={{margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={styles.pickerLabel}>{this.props.label}</Text>
        <View style={[styles.picker, {
        borderColor: this.props.isHighlighted ? Colors.accentColor : Colors.buttonColor,
        borderRadius: this.props.isHighlighted ? 25 : 20,
        width: this.props.isHighlighted ? 210 : 200,
        minHeight: this.props.isHighlighted ? 50 : 40}]}>
          <Picker
            style={{width: this.props.isHighlighted ? 210 : 200,
                    maxWidth: this.props.isHighlighted ? 200 : 190,
                    marginRight: -5,
                    marginBottom: -10,
                    marginTop: this.props.isHighlighted ? 5 : 0,
                    minHeight: 40}}
            onValueChange={this.handlePicker}
            items={this.data}
            title={this.props.label}
            placeholder="Выберите"
            doneText='Выбрать'
            value={this.state.pickedData}
            onItemChange={(item) => {this.props.onUpdate(item.value)}}
            placeholderStyle={styles.pickerText}
            androidPickerMode="dialog"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonColor,
    borderColor: Colors.buttonColor,
    borderWidth: 5,
    marginRight: 10
  },
  pickerLabel: {
    fontWeight: 'bold',
    color: Colors.textColor,
    margin: 5,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center'
  },
  pickerText:{
    marginBottom: 10,
    fontSize: 18,
    alignSelf: 'center',
    color: Colors.textColor
   }
})
