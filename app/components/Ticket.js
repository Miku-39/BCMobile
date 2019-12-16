import React, { Component } from 'react'
import * as WebBrowser from 'expo-web-browser';
import {  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { Colors } from '../theme'
import * as selectors from '../middleware/redux/selectors'
import { connect } from 'react-redux'
import { fetch } from '../middleware/redux/actions/Tickets'
import { update, dismiss, getFile } from '../middleware/redux/actions/Ticket'

const statusNames = {
  '421575459000': 'Отклонена',
  '12884953000': 'Принята'
}

const REJECTED_STATUS_ID = '421575459000';
const ACCEPTED_STATUS_ID = '12884953000';
const ON_CREATE_STATUS_ID = '4285215000';

const allowedStatuses = [
  REJECTED_STATUS_ID,
  ACCEPTED_STATUS_ID,
  ON_CREATE_STATUS_ID
]

@connect(
    store => ({
        session: selectors.getSession(store),
        error: selectors.getIsTicketAddingFailed(store),
        fileDownloaded: selectors.getIsFileDownloaded(store),
        link: selectors.getLink(store),
    }),
    dispatch => ({
        dismiss: () => dispatch(dismiss()),
        getFile: (fileId) => dispatch(getFile(fileId))
    })
)

export default class Ticket extends React.Component {
  constructor(props) {
     super(props);
     this.state = {}
  }

  componentWillReceiveProps(newProps) {
    const { fileDownloaded, fileDownloadingFailed, error, link } = newProps

    if (link){
        console.log(link)
        //WebBrowser.openBrowserAsync(
          //`https://api.claris.su/main/vNext/v1/files?downloadId=${link}`
        //);
        //Linking.openURL(
          //`https://api.claris.su/main/vNext/v1/files?downloadId=${link}`
        //)
        const receiptUrl = link
        Linking.canOpenURL(receiptUrl).then(supported => {
          if (supported) {
            Linking.openURL(receiptUrl);
          } else {
            Alert.alert(
              "Ошибка",
              "Не удалось найти программу, чтобы открыть файл данного формата",
              [{ text: "Закрыть", onPress: () => {} }]
            );
          }
        });

    }

    if (error) {
        console.error(error)
        Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
        [{text: 'Закрыть', onPress: () => { }}])
    }
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    const { fieldsProperties, changeStatus, ticket } = this.props

    const handleShowFilePress = () => {
      this.props.getFile(ticket.file.id)
    }

    const updateStatus = (status) => {
      Alert.alert(
      'Изменение статуса',
      ('Для заявки' + (ticket.number && (' №'+ticket.number)) + ' будет установлен статус "'+statusNames[status]+'"'),
      [
        {
          text: 'Отмена',
          onPress: () => {}
        },
        {text: 'ОК', onPress: () => {
          ticket.status.id = status
          ticket.status.alternativeName = statusNames[status]
          ticket.status.name = statusNames[status]
          this.props.updateItem(ticket)
          this.props.goBack()
        }},
      ],
      {cancelable: false},
    );
    }

    const fieldGroupRenderer = (fieldGroup) => {
      var fields = []
      Object.keys(fieldGroup).forEach(function(key) {
        try {
        value = ticket[key]
        if(value){
          if(fieldGroup[key].type == 'text'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>{fieldGroup[key].name}</Text>
                            <Text style={styles.field}>{value}</Text>
                        </View>)
          }
          if(fieldGroup[key].type == 'list'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>{fieldGroup[key].name}</Text>
                            <Text style={styles.field}>{value.name}</Text>
                        </View>)
          }
          if(fieldGroup[key].type == 'date'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>{fieldGroup[key].name}</Text>
                            <Text style={styles.field}>{value.substring(0, 10)}</Text>
                        </View>)
          }
          if(fieldGroup[key].type == 'file'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>{fieldGroup[key].name}</Text>
                            <Text onPress={() => {handleShowFilePress()}} style={[styles.field, {color: '#006699'}]}>{value.name}</Text>
                        </View>)
          }

      }
    }catch(err){console.error(err.message)}})

      return(fields[0] ?
             <View style={styles.fieldsContainer}>
                 { fields }
                 <View style={{marginBottom: 10}}/>
             </View> : null)
  }

    var fieldGroups = []
    for(fieldGroup in fieldsProperties){
      fieldGroups.push(fieldGroupRenderer(fieldsProperties[fieldGroup]))
    }
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView>
            <View style={{marginBottom: 150, marginLeft: 5, marginRight: 5}}>
                { fieldGroups }


                { (this.props.session.isLesnaya &&
                   (this.props.session.roles.includes('restrictedAdministratorBC') ||
                   this.props.session.roles.includes('administratorBC')) &&
                   this.props.session.roles.includes('makingAgreementBC') &&
                   allowedStatuses.includes(this.props.ticket.status.id)) &&
                  <View style={styles.buttonsContainer}>
                      {this.props.ticket.status.id != REJECTED_STATUS_ID &&
                      <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.buttonColor,
                           width: this.props.ticket.status.id == ACCEPTED_STATUS_ID ? '90%' : '45%'}]}
                        onPress={() => {updateStatus(REJECTED_STATUS_ID)}}>
                            <View style={styles.buttonLabelContainer}>
                              <Text style={[styles.field,
                                 {marginBottom: 5, marginRight: 5}]}>Отклонить</Text>
                            </View>
                      </TouchableOpacity>}

                      {this.props.ticket.status.id != ACCEPTED_STATUS_ID &&
                      <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.accentColor,
                           width: this.props.ticket.status.id == REJECTED_STATUS_ID ? '90%' : '45%'}]}
                        onPress={() => {updateStatus(ACCEPTED_STATUS_ID)}}>
                            <View style={styles.buttonLabelContainer}>
                              <Text style={[styles.field,
                                 {color: 'white', marginBottom: 5, marginRight: 5}]}>Принять</Text>
                            </View>
                      </TouchableOpacity>}
                  </View>
                }


            </View>
            </ScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
   fieldsContainer: {
     backgroundColor: Colors.fieldsColor,
     borderRadius: 20,
     marginBottom: 10
   },
   fieldTitle: {
     marginLeft: 10,
     marginTop: 10,
     fontSize: 18,
     color: Colors.textColor
   },
   field: {
     marginLeft: 10,
     marginTop: 5,
     fontSize: 20
   },
   buttonsContainer: {
     width: '100%',
     marginTop: 15,
     justifyContent: 'space-around',
     flexDirection: 'row'
   },
   button: {
     height: 60,
     width: '45%',
     borderRadius: 20,
     justifyContent: 'center',
     alignItems: 'center'
   },
   buttonLabelContainer: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center'
   }
})
