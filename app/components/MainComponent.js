import React, { Component } from 'react';
import { ScrollView,
         View,
         Image,
         Text,
         TouchableOpacity,
         StyleSheet,
         Alert,
         NativeModules,
         LayoutAnimation } from 'react-native';

import { Images, Colors, Metrics } from '../theme'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default MainComponent = (props) => {
  Text.defaultProps = Text.defaultProps || {};
  //Text.defaultProps.allowFontScaling = false;
  const { session } = props
    return (
        <ScrollView style={styles.mainContainer}>
            {
                /*<View style={styles.headerContainer}>
                    <Image source={Images.zhukovHeader} style={styles.headerImage} />
                </View>*/
            }
                  <View style={styles.contentContainer} onLayout={() => {LayoutAnimation.easeInEaseOut();}}>

                    {(session.isLesnaya && !session.roles.includes('tenant')) &&
                    <TouchableOpacity onPress={() => { props.openTickets('openTickets') }}>
                        <View style={styles.Button}>
                            <Image resizeMode='contain' source={Images.list} style={styles.buttonImage}/>
                            <Text style={styles.buttonLabel}>Активные</Text>
                        </View>
                    </TouchableOpacity>}

                    {(session.isLesnaya && !session.roles.includes('tenant')) &&
                    <TouchableOpacity onPress={() => { props.openTickets('onCreateTickets') }}>
                        <View style={styles.Button}>
                            <Image resizeMode='contain' source={Images.sign} style={styles.buttonImage}/>
                            <Text style={styles.buttonLabel}>Согласовать</Text>
                        </View>
                    </TouchableOpacity>}

                    <TouchableOpacity onPress={() => { props.addVisitTicket() }}>
                        <View style={styles.Button}>
                            <Image resizeMode='contain' source={Images.hand} style={styles.buttonImage} />
                            <Text style={styles.buttonLabel}>На{"\n"}посещение</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { props.addCarTicket() }}>
                        <View style={styles.Button}>
                            <Image resizeMode='contain' source={Images.car} style={styles.buttonImage} />
                            <Text style={styles.buttonLabel}>На{"\n"}въезд авто</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { props.addGoodsTicket('GOODS_IN') }}>
                          <View style={styles.Button}>
                              <Image resizeMode='contain' source={Images.boxIn} style={styles.buttonImage} />
                              <Text style={styles.buttonLabel}>Внос имущества</Text>
                          </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { props.addGoodsTicket('GOODS_OUT') }}>
                          <View style={styles.Button}>
                              <Image resizeMode='contain' source={Images.boxOut} style={styles.buttonImage} />
                              <Text style={styles.buttonLabel}>Вынос имущества</Text>
                          </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { props.addServiceTicket() }}>
                        <View style={styles.Button}>
                          <Image resizeMode='contain' source={Images.wrench} style={styles.buttonImage} />
                          <Text style={styles.buttonLabel}>Сервисная</Text>
                        </View>
                    </TouchableOpacity>

                    {!(session.isLesnaya && !session.roles.includes('tenant')) &&
                    <TouchableOpacity onPress={() => { props.openTickets('regularTickets') }}>
                        <View style={styles.Button}>
                            <Image resizeMode='contain' source={Images.list} style={styles.buttonImage}/>
                            <Text style={styles.buttonLabel}>Наши заявки</Text>
                        </View>
                    </TouchableOpacity>}

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    headerContainer: {
        height: 240,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    headerImage: {
        width: '100%',
        resizeMode: 'stretch'
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 59
    },
    Button: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 165,
        height: 165,
        borderRadius: 15,
        margin: 10,
        backgroundColor: 'white',
    },
    buttonImage: {
        width: 85,
        height: 85,
        margin: 5
    },
    buttonLabel: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center'
    },
    field: {
      margin: 10,
      color: Colors.textColor,
      fontSize: 22,
      fontWeight: '500',
      textAlign: 'center'
    },
    fieldsContainer: {
      alignItems: 'center',
      backgroundColor: Colors.fieldsColor,
      borderRadius: 15,
      width: '90%',
      marginBottom: 15,
      marginTop: 15
    }
})
