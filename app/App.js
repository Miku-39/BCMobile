import React, { Component } from "react";
import { Platform, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { StackNavigator } from "react-navigation";

import store from "./middleware/redux";
import LoginScreen from "./containers/LoginScreen";
import MainScreen from "./containers/MainScreen";
import TicketsScreen from "./containers/TicketsScreen";
import VisitorScreen from "./containers/VisitorScreen";
import ServiceScreen from "./containers/ServiceScreen";
import AltServiceScreen from "./containers/AltServiceScreen";
import GoodsScreen from "./containers/GoodsScreen";
import TicketScreen from "./containers/TicketScreen";
import CheckpointScreen from "./containers/CheckpointScreen";
import CardScreen from "./containers/CardScreen";
import { Metrics, Colors } from "./theme";

const styles = StyleSheet.create({
  back: {
    backgroundColor: Colors.accentColor,
  },
  title: { color: "white" },
});

const Navigation = StackNavigator(
  {
    Login: { screen: LoginScreen, navigationOptions: { header: null } },
    Main: { screen: MainScreen },
    Service: { screen: ServiceScreen },
    AltService: { screen: AltServiceScreen },
    Visitor: { screen: VisitorScreen },
    Goods: { screen: GoodsScreen },
    Tickets: { screen: TicketsScreen },
    Ticket: { screen: TicketScreen },
    Card: { screen: CardScreen },
    Checkpoint: { screen: CheckpointScreen },
  },
  {
    initialRouteName: "Login",
    navigationOptions: {
      headerStyle: styles.back,
      headerTitleStyle: styles.title,
      headerTintColor: "white",
    },
  }
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
