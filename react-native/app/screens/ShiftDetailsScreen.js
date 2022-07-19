import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import {moneyParser, scheduleParser} from "../../utils";

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
    instructions:"Arrive 10min early, wear black shoes, and come through the back door.",
    tasks:"Unpack boxes%b%Ship packages",
    status:1 //0 = waiting approval, 1 = accepted, 2 = denied, 3 = cancelled by worker, 4 = cancelled by employer
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

  
  let splittedTasks = shift.tasks && shift.tasks.length>0?shift.tasks.split("%b%"):[];

  let actions = null;
  if(shift.status == 0){
    actions = (
        <View style={[styles.section, {flexDirection:"row", alignItems:"center", justifyContent:"center", paddingTop:50}]}>
            <TouchableWithoutFeedback onPress={()=>{alert("Accept")}}>
                <View style={[globalStyle.regularText,{marginRight:20, paddingHorizontal:25, paddingVertical:10, backgroundColor:"green", borderRadius:50, alignSelf:"stretch", flex:1, alignItems:"center"}]}><Text style={{color:"white"}}>Accept</Text></View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={()=>{alert("Decline")}}>
                <View style={[globalStyle.regularText,{ paddingHorizontal:25, paddingVertical:10, borderColor:"red",borderWidth:2, borderRadius:50, alignSelf:"stretch", flex:1, alignItems:"center"}]}><Text>Decline</Text></View>
            </TouchableWithoutFeedback>
        </View>
    );
  }else if(shift.status == 1){
    actions = (
        <View style={[styles.section, {flexDirection:"column", alignItems:"center", justifyContent:"center", paddingTop:50}]}>
            <TouchableWithoutFeedback onPress={()=>{alert("Cancel")}}>
                <Text style={[globalStyle.regularText, {color:"red", marginBottom:10}]}>Cancel shift</Text>
            </TouchableWithoutFeedback>
            <Text style={[globalStyle.regularText, {color:"#rgba(0,0,0,0.5)"}]}>ⓘ You can only cancel an accepted shift twice. After that, your account will be suspended for 14 days due to ...</Text>
        </View>
    );
  }

  return (
        <SemiFullPageScreen>
          <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Details</Text>
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
                    <Text style={[globalStyle.regularText]}>{shift.company}</Text>
                    <Text style={[globalStyle.title2, {marginBottom:10}]}>{moneyParser(shift.hourly_wage)}/hr</Text>
                    <TouchableWithoutFeedback onPress={()=>{alert("Chat")}}>
                        <View style={{borderRadius:100, padding:10, backgroundColor:"rgba(0,0,0,0.15)", alignSelf:"flex-start", marginBottom:10}}>
                            <Image style={{height:35, width:35, tintColor:"black"}} source={require("../../assets/icons/message-circle.png")}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    splittedTasks.length>0?
                    (
                        <View style={styles.section}>
                            <Text style={[globalStyle.title2, styles.sectionTitle]}>Tasks</Text>
                            {
                                splittedTasks.map((value, key)=>{
                                    return <Text style={[globalStyle.regularText]} key={key}>{'\u2022'} {value}</Text>
                                })
                            }
                        </View>
                    )
                    : null
                }
                <View style={styles.section}>
                    <Text style={[globalStyle.title2, styles.sectionTitle]}>Address</Text>
                    <View style={styles.mapContainer}></View>
                    <Text style={[globalStyle.regularText]}>{shift.full_address}</Text>
                </View>
                {
                    shift.start_datetime && shift.end_datetime ?
                        <View style={styles.section}>
                            <Text style={[globalStyle.title2, styles.sectionTitle]}>Schedule</Text>
                            <Text style={[globalStyle.regularText]}>{scheduleParser(shift.start_datetime, shift.end_datetime)}</Text>
                        </View>
                    :null
                }
                <View style={styles.section}>
                    <Text style={[globalStyle.title2, styles.sectionTitle]}>Instructions</Text>
                    <Text style={[globalStyle.regularText]}>{shift.instructions}</Text>
                </View>
                {actions}
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
