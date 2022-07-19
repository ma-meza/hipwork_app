import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import {moneyParser, scheduleParser, timestampParser} from "../../utils";


const paymentsArray = [
  {
    id:2923232323,
    timestamp:"1630164243",
    net_pay:13200
  }
];

export default function HomeScreen({navigation, route, goToHome}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [paymentsHistory, setPaymentsHistory] = React.useState([]);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);



  useEffect(()=>{
      setPaymentsHistory([...paymentsArray]);
  }, []);


  return (
        <SemiFullPageScreen>
          <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Payments</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
          </View>
          <ScrollView style={styles.sectionView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
              <View style={styles.section}>
                <Text style={[globalStyle.title2, styles.sectionTitle]}>Details</Text>
                <Text style={[globalStyle.regularText]}>Send payments to <Text style={globalStyle.regularTextBold}>+1 (514) 996-6247</Text></Text>
                <Text style={[globalStyle.regularText, {marginBottom:10}]}>Interac secret answer: <Text style={globalStyle.regularTextBold}>199228a</Text></Text>
                <TouchableWithoutFeedback onPress={()=>{alert("Edit details")}}>
                  <Text style={[globalStyle.regularTextBold, {color:"#0c8881"}]}>Edit details</Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.section}>
                <Text style={[globalStyle.title2, styles.sectionTitle]}>Payments history</Text>
                {
                  paymentsHistory.length>0?
                    paymentsHistory.map((value, key)=>{
                      return (
                        <View key={key} style={styles.card}>
                          <Text style={[globalStyle.regularText]}>#{value.id}</Text>
                          <Text style={[globalStyle.title2]}>{moneyParser(value.net_pay)}</Text>
                          <Text style={[globalStyle.regularText]}>{timestampParser(value.timestamp)}</Text>
                        </View>
                      );
                    })
                    :
                    <Text>No payments yet.</Text>
                }
              </View>
          </ScrollView>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  greyText:{
    color:"#a1a1a1"
  },
  sectionView:{
    backgroundColor:"#fdfdfd",
    width:"100%",
    paddingBottom:20,
    paddingTop:10
  },
  sectionTitle:{
    marginBottom:10
  },
  section:{
    paddingHorizontal:20,
    paddingBottom:25,
    flex:1
  },
  card:{
    padding:10,
    borderWidth:1,
    borderColor:"rgba(0,0,0,0.4)",
    borderRadius:5
  }
});
