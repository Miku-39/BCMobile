import { Dimensions, Platform } from 'react-native'
import { Constants } from 'expo'

const { width, height } = Dimensions.get('window')

const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: 54,//(Platform.OS === 'ios') ? 64 : 54,
  statusBarHeight: Constants.statusBarHeight,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300
  }
}

export default metrics
