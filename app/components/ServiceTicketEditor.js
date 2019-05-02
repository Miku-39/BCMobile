import React, { Component } from 'react'
import {  View,
          ScrollView,
          Text,
          StyleSheet,
          Image,
          Picker,
          TouchableOpacity,
          Platform,
          TextInput,
          NativeModules,
          LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import ReactNativePickerModule from 'react-native-picker-module'
import { CheckBox } from 'react-native-elements'
import ImagePickerComponent from '../components/ImagePicker'
import { Images, Colors } from '../theme'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class ServiceTicketScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       selectedService: this.props.initialService,
       mop: false
     }
  }
  updateMOP = () =>{
    LayoutAnimation.spring();
    this.setState({mop: !this.state.mop})
    this.props.updateMOP(!this.state.mop)
  }
  updateImage = (uri) => {
    this.props.saveFile(uri)
    LayoutAnimation.spring();
    this.setState({image: uri})
  }
  render () {
    const { services } = this.props
    idByIndex = services.map(service => {return service.id})
    servicesByIndex = services.map(service => {return service.name})
    androidMargin = Platform.OS === 'android' ? 7 : 0
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView>
                  {
                    Platform.OS === 'android' &&
                    <View style={{marginTop: 10}}>
                    <Text style={styles.pickerLabel}>Сервис</Text>
                    <View style={styles.picker}>
                    <Picker
                        selectedValue={this.state.selectedService}
                        style={{height: 40, width: 180}}
                        onValueChange={(itemValue, itemIndex) =>
                        {
                        this.props.updateService(itemValue, idByIndex[itemIndex]);
                        this.setState({selectedService: itemValue})
                        }
                        }>
                        {services.map(service => {return <Picker.Item label={service.name} value={service.name}/>})}
                    </Picker>
                    </View>
                    </View>
                  }

                  {
                      Platform.OS === 'ios' &&
                      <View style={{marginTop: 10}}>
                      <Text style={styles.pickerLabel}>Сервис</Text>
                        <ReactNativePickerModule
                                        pickerRef={e => pickerRef = e}
                                        value={this.state.selectedValue}
                                        title='Сервис'
                                        cancelButton='Отмена'
                                        confirmButton='Выбрать'
                                        items={services.map(service => {return service.name})}
                                        onValueChange={(value) => {
                                             this.props.updateService(servicesByIndex[value], idByIndex[value]);
                                             this.setState({selectedValue: value })
                                             this.setState({selectedService: servicesByIndex[value]})
                                        }}/>

                        <TouchableOpacity onPress={() => {pickerRef.show()}} style={styles.picker}>
                          <Text style={styles.pickerText}>{this.state.selectedService}</Text>
                        </TouchableOpacity>

                      </View>
                    }
                    {this.props.ticketType == 'SERVICE' &&
                    <View style={{
                     marginTop: 10,
                     backgroundColor: '#FFF',
                     borderRadius: 10,
                     flexDirection: 'column',
                     height: 64}}>

                    <CheckBox
                      title='Место общего пользования'
                      containerStyle={styles.checkboxContainer}
                      textStyle={styles.checkboxText}
                      checked={this.state.mop}
                      onPress={this.updateMOP}
                    />
                    </View>
                  }
                    {
                      !this.state.mop &&
                        <Fumi
                            style={styles.fumiInput}
                            label={'Помещение'}
                            iconClass={Icon}
                            iconName={'room'}
                            iconColor={'#53565A'}
                            iconSize={20}
                            inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                            onChangeText={this.props.updateRoom}
                            inputPadding={16}
                        />

                      }
                      {
                        this.props.ticketType == 'ALT_SERVICE' &&
                          <Fumi
                              style={styles.fumiInput}
                              label={'Поставщик материалов'}
                              iconClass={Icon}
                              iconName={'room'}
                              iconColor={'#53565A'}
                              iconSize={20}
                              inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                              onChangeText={this.props.updateMaterialSupplier}
                              inputPadding={16}
                          />

                        }

                      <TextInput
                        placeholder="Что сделать"
                        underlineColorAndroid='transparent'
                        style={styles.textInputStyle}
                        multiline={true}
                        scrollEnabled={true}
                        onChangeText={this.props.updateWhatHappened}
                        />

                        <ImagePickerComponent
                          onChoose={this.updateImage}/>
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
     margin: 10,
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
     alignSelf: 'center'
   },
   pickerText:{
     fontSize: 18,
     alignSelf: 'center',
     margin: 8,
     color: '#53565A'
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
   },
   textInputStyle:{
    height: 160,
    borderRadius: 10,
    backgroundColor : "#FFF",
    marginTop: 10,
    fontSize: 18,
    color: '#53565A',
    padding: 10,
    paddingTop: 10
  },
  fumiInput:{
    marginTop: 10,
    borderRadius: 10
  },
  image:{
    margin: 10,
    width: 200,
    height: 200,
    borderRadius: 15,
    borderColor: '#53565A',
    borderWidth: 3,
    alignSelf: 'center'
  }
})
