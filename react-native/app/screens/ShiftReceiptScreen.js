import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import {moneyParser, scheduleParser, timeParser} from "../../utils";

const cutAfterMaxLength = (sentence, length)=>{
  return sentence.substring(0, length)+"...";
};

const shiftObj = {
    id:2,
    hourly_wage:1350,
    start_datetime:'2021-07-30 09:00:00',
    end_datetime:'2021-07-30 17:00:00',
    company:"Escapade festival",
    job_type_name:"Event worker",
    full_address:"33 Rene-Levesque, Montreal, Qc, Canada H3G2P5",
    gross_pay:10000,
    work_hours:7.5,
    clock_in:"09:01:00",
    clock_out:"17:05:21",
    net_pay:null
  }

export default function HomeScreen({navigation, route, goToHome}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [shift, setShift] = React.useState({});

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);



  useEffect(()=>{
    setShift(shiftObj);
  }, []);

  

  return (
        <SemiFullPageScreen>
          <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Summary</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
          </View>
          <ScrollView style={styles.sectionViewNoPadding}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
            <View style={{paddingBottom:20}}>
                <View style={styles.section}>
                    <Text style={[globalStyle.title1]}>{shift.job_type_name}</Text>
                    <Text style={[globalStyle.regularText]}>{shift.company} ({shift.full_address})</Text>
                    <Text style={[globalStyle.title2, {marginBottom:10}]}>{moneyParser(shift.gross_pay)} ({shift.work_hours}hrs @ {moneyParser(shift.hourly_wage)}/hr)</Text>
                </View>
                {
                    shift.start_datetime && shift.end_datetime ?
                        <View style={styles.section}>
                            <Text style={[globalStyle.title2, styles.sectionTitle]}>Schedule</Text>
                            <Text style={[globalStyle.regularText]}>{scheduleParser(shift.start_datetime, shift.end_datetime)}</Text>
                        </View>
                    :null
                }
                {
                    shift.clock_in && shift.clock_out ?
                        <View style={styles.section}>
                            <Text style={[globalStyle.title2, styles.sectionTitle]}>Clock in/out</Text>
                            <Text style={[globalStyle.regularText]}>In: {timeParser(shift.clock_in)}</Text>
                            <Text style={[globalStyle.regularText]}>Out: {timeParser(shift.clock_out)}</Text>
                        </View>
                    :null
                }
                <View style={styles.section}>
                    <Text style={[globalStyle.title2, styles.sectionTitle]}>Pay</Text>
                    <Text style={[globalStyle.regularText]}>Gross pay: +{moneyParser(shift.gross_pay)}</Text>
                    <Text style={[globalStyle.regularText]}>fees: -{moneyParser(shift.gross_pay * 0.02)} (2%)</Text>
                    <Text style={[globalStyle.regularText]}>Net pay: {shift.net_pay? moneyParser(shift.net_pay) : "TBD"}</Text>
                </View>
                
                <Text style={[globalStyle.regularText, {color:"#rgba(0,0,0,0.5)", flex:1, paddingHorizontal:20, paddingVertical:20}]}>ⓘ This is your gross pay, subject to verification by the business and does not include withholding, other required taxes, or any other deductions required by applicable law.</Text>
            </View>
          </ScrollView>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  section:{
      paddingHorizontal:20,
      paddingBottom:15,
      flex:1
  },
  greyText:{
    color:"#a1a1a1"
  },
  sectionView:{
    width:"100%",
    paddingBottom:20,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
  },
  sectionViewNoPadding:{
    backgroundColor:"#fdfdfd",
    width:"100%",
    paddingTop:10
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer:{
      width:"100%",
      backgroundColor:"grey",
      aspectRatio:1.75,
      borderRadius:5,
      marginBottom:5
  },
  sectionTitle:{
      marginBottom:5
  }
});
