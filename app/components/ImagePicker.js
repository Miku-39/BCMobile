import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image, Platform } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

export default class ImagePickerComponent extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       image: null
     }
  }

  _pickImage = async () => {
    await this._askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: Platform.OS === 'android'
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      console.log(result.uri)
      this.props.onChoose(result.uri)
    }
  };

  _launchCamera = async () => {
    await this._askPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: Platform.OS === 'android'
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.props.onChoose(result.uri)
    }
  }

  _askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };


  render() {
    let { image } = this.state;
    return (
      <View style={{marginTop: 10, alignItems: 'center'}}>
        <Text style={styles.pickerLabel}>Выберите фото</Text>

        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={this._pickImage}
            style={styles.picker}>
            <Text style={styles.pickerText}>Из галереи</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this._launchCamera}
            style={styles.picker}>
            <Text style={styles.pickerText}>Сделать снимок</Text>
          </TouchableOpacity>
        </View>

        {image &&
          <View style={styles.image, {margin: 15}}>
            <Image resizeMode='cover' source={{ uri: image }} style={styles.image} />
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
   pickerContainer: {
     flex: 1,
     borderRadius: 20,
     margin: 10,
     alignSelf: 'center',
     alignItems: 'center',
     backgroundColor: '#C9C8C7',
     flexDirection: 'column'
   },
   picker: {
     borderRadius: 20,
     margin: 5,
     width: 200,
     alignSelf: 'center',
     alignItems: 'center',
     backgroundColor: '#C9C8C7',
     flexDirection: 'column'
   },
   pickerLabel: {
     fontSize: 16,
     color: '#53565A',
     fontWeight: 'bold',
     textAlign: 'center'
   },
   pickerText:{
     fontSize: 18,
     color: '#53565A'
    },
    image: {
      borderRadius: 20,
      width: 300,
      height: 300,
      borderWidth: 5,
      borderColor: '#C9C8C7'
    }
})
