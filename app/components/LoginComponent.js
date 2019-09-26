import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  Button,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native'

import { CheckBox } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'

import { Colors, Images, Metrics } from '../theme'


class LoginComponent extends Component {
    render() {
        const keyboardVerticalOffset = 50
        return (
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={styles.screenContainer}>
                <View style={styles.logoContainer}>
                    <Image source={Images.logo} resizeMode='contain' style={styles.logo} />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.inputsContainer}>
                        <View style={styles.inputFieldContainer}>

                            <View style={styles.iconContainer}>
                                <MaterialIcons name='person' size={28} color='gray' />
                            </View>

                            <View style={styles.verticalDivider}></View>

                            <TextInput
                                style={styles.input}
                                onChange={ (e) => this.props.changeUser(e.nativeEvent.text) }
                                autoCapitalize='none'
                                autoCorrect={false}
                                spellCheck={false}
                                placeholder='Введите имя пользователя'
                                value={this.props.user}
                                disabled={this.props.disabled}
                                autoCorrect={false}
                                underlineColorAndroid='transparent' />

                        </View>

                        <View style={styles.horizontalDivider}></View>

                        <View style={styles.inputFieldContainer}>

                            <View style={styles.iconContainer}>
                                <MaterialIcons name='lock' size={26} color='gray' />
                            </View>

                            <View style={styles.verticalDivider}></View>

                            <TextInput
                                style={styles.input}
                                onChange={ (e) => this.props.changePassword(e.nativeEvent.text) }
                                autoCapitalize="none"
                                placeholder="Введите пароль"
                                autoCorrect={false}
                                value={this.props.password}
                                disabled={this.props.disabled}
                                secureTextEntry={true}
                                underlineColorAndroid='transparent' />

                        </View>
                    </View>

                    <View style={styles.enterContainer}>
                        <TouchableOpacity onPress={() => {
                            Keyboard.dismiss()
                            this.props.logIn()
                        }}>
                            <View style={styles.enterButton}>
                                <Text style={styles.enterText}>Войти</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    {
                        this.props.disabled ?
                        <View style={{alignSelf: 'center', marginTop: 20}}>
                            <ActivityIndicator size="large" color={Colors.accentColor}/>
                        </View> : null
                    }
                </View>
            </KeyboardAvoidingView>

        )
    }
}

export default LoginComponent


const styles = StyleSheet.create({ // стили всех элементов
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
    // resizeMode: 'cover', // or 'stretch'
  },
  screenContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '70%'
  },
  logoContainer: { //расположение логотипа
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    //margin: 40
  },
  logo: { //логотип
    width: 200,
  },
  contentContainer: {
    height: '25%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },

  inputsContainer: { // заполняемое окно
    flexDirection: 'column',
    alignItems: 'center',
    width: Metrics.screenWidth
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '94%',
    height: 50,
    backgroundColor:'white',
    borderRadius: 7,
    opacity: 0.9
  },

  iconContainer: {
    width: 45,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f6f6f6'
  },
  input: {
    width: '90%',
    height: 50,
    marginLeft: 7,
    marginTop: 1,
    textAlignVertical: 'center',
    fontSize: 17,
    color: 'gray'
  },
  horizontalDivider: {
    height: 5
  },
  enterContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  enterButton: { // кнопка
    justifyContent: 'center',
    backgroundColor: Colors.accentColor,
    minWidth: 245,
    minHeight: 45,
    borderRadius: 30
  },
  enterText: { // вводимый текст
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    margin: 5
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'gray'
  }
});
