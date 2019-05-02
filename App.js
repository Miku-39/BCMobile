import React from 'react'
import App from './app/App'

export default class Root extends React.Component {
  render() {
    console.disableYellowBox = true;
    return (
      <App />
    )
  }
}
