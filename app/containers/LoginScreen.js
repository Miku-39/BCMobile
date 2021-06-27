import React, { Component } from "react";
import { Alert } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import { login } from "../middleware/redux/actions/Session";
import { getSession } from "../middleware/redux/selectors";
import {
  storeCredentials,
  loadCredentials,
} from "../middleware/utils/AsyncStorage";

import LoginComponent from "../components/LoginComponent";
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "../middleware/push/registerForPushNotificationsAsync.js";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

@connect(
  (store) => ({ session: getSession(store) }),
  (dispatch) => ({ login: (user, password) => dispatch(login(user, password)) })
)
export default class LoginScreen extends Component {
  state = { notification: {}, user: "", password: "", remember: true };

  componentDidMount = async () => {
    const { remember, user, password, token } = await loadCredentials();
    if (remember && user && password)
      this.setState({ remember, user, password, token });
    registerForPushNotificationsAsync();
    Notifications.addNotificationResponseReceivedListener(
      this._handleNotificationResponse
    );
  };

  componentWillReceiveProps = async (nextProps) => {
    const { logged, error, userId, roles, token } = nextProps.session;
    const { dispatch } = this.props.navigation;

    if (logged) {
      const { remember, user, password } = this.state;

      if (remember) await storeCredentials(user, password, token);

      //OneSignal.configure({})
      //OneSignal.sendTag('userId', userId)
      const route =
        roles.includes("mobileCheckpoint") ||
        roles.includes("bolshevikSecurityChief")
          ? "Checkpoint"
          : "Main";
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
        key: null,
      });
      dispatch(resetAction);
    }

    if (error) {
      Alert.alert("Ошибка", error, [{ text: "Закрыть", onPress: () => {} }]);
    }
  };

  _handleNotificationResponse = (response) => {
    console.log("response");
    const ticket = response.notification.request.content.data.body.ticket;
    const { navigate, dispatch } = this.props.navigation;
    const { token } = this.state;
    navigate("Ticket", { ticket, updateItem: () => {}, token });
  };

  _handleUserChange = (user) => this.setState({ user });

  _handlePasswordChange = (password) => this.setState({ password });

  _handleRememberChange = () => {
    const { remember } = this.state;
    this.setState({ remember: !remember });
  };

  _handleLogInClick = () => {
    const { user, password } = this.state;
    if (!user || !password)
      Alert.alert("Ошибка", "Необходимо заполнить имя пользователя и пароль", [
        { text: "Закрыть", onPress: () => {} },
      ]);
    else this.props.login(user, password);
  };

  render = () => {
    const { user, password, remember } = this.state;
    const { isLogging } = this.props.session;

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
    );
  };
}
