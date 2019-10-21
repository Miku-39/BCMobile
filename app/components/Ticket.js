import React, { Component } from 'react'
import {  View,
  ScrollView,
  Text,
  StyleSheet
} from 'react-native';
import { Colors } from '../theme'

export default class Ticket extends Component {
  constructor(props) {
     super(props);
     this.state = {}
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    //Text.defaultProps.allowFontScaling = true;
    const { fieldsProperties, ticket } = this.props
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

      }
    }catch{ }})

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
            <View style={{marginBottom: 150}}>
                { fieldGroups }
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
     fontSize: 14,
     color: Colors.textColor
   },
   field: {
     marginLeft: 10,
     marginTop: 5,
     fontSize: 18
   }
})
