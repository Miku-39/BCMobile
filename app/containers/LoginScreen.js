import React, { Component } from 'react'
import { View, StatusBar, Alert } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
//import OneSignal from 'react-native-onesignal'

import { login } from '../middleware/redux/actions/Session'
import { getSession } from '../middleware/redux/selectors'
import { storeCredentials, loadCredentials } from '../middleware/utils/AsyncStorage'

import LoginComponent from '../components/LoginComponent'


@connect(
    (store) => ({ session: getSession(store)}),
    (dispatch) => ({ login: (user, password) => dispatch(login(user, password)) })
)
export default class LoginScreen extends Component {
    state = { user: '', password: '', remember: true}

    componentDidMount = async () => {
        const { remember, user, password } = await loadCredentials()
        if (remember && user && password)
            this.setState({remember, user, password})
    }

    componentWillReceiveProps = async (nextProps) => {
        const { logged, error, userId, roles } = nextProps.session
        const { dispatch } = this.props.navigation

        if (logged) {
            const { remember, user, password } = this.state

            if (remember)
                await storeCredentials(user, password)

            //OneSignal.configure({})
            //OneSignal.sendTag('userId', userId)
            const route =  'Main'

            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: route })
                ],
                key: null
            })
            dispatch(resetAction)
        }

        if (error) {
            Alert.alert( 'Ошибка', error, [ {text: 'Закрыть', onPress: () => { }} ])
        }
    }

    _handleUserChange = (user) => this.setState({user})

    _handlePasswordChange = (password) => this.setState({password})

    _handleRememberChange = () => {
        const { remember } = this.state
        this.setState({remember: !remember})
    }

    _handleLogInClick = () => {
        const { user, password } = this.state
        if (!user || !password)
            Alert.alert( 'Ошибка', 'Необходимо заполнить имя пользователя и пароль', [ {text: 'Закрыть', onPress: () => { }} ])
        else this.props.login(user, password)
    }

    render = () => {
        const { user, password, remember } = this.state
        const { isLogging } = this.props.session

        return (
            <LoginComponent
                user={user}
                password={password}
                disabled={isLogging}
                remember={remember}
                changeUser={this._handleUserChange}
                changePassword={this._handlePasswordChange}
                changeRemember={this._handleRememberChange}
                logIn={this._handleLogInClick}
            />
        )
    }
}
