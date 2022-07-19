import React, {useEffect} from 'react';
import { BackHandler, StyleSheet, Easing, Animated, RefreshControl, Text, View, SafeAreaView, Image, StatusBar, TouchableWithoutFeedback, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, Dimensions } from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {moneyParser, scheduleParser} from "../../utils";
import CardBarTimer from "../components/CardBarTimer";


const globalStyle = require('../../assets/style/globalStyle');


const windowWidth = Dimensions.get('window').width;



const currentOffersArray = [
  {
    id:1,
    hourly_wage:1400,
    start_datetime:'2021-07-28 09:00:00',
    end_datetime:'2021-07-28 17:00:00',
    company:"Amazon1",
    job_type_name:"Warehouse worker",
    max_approval_timestamp:"1630183410"
  },
  {
    id:2,
    hourly_wage:1400,
    start_datetime:'2021-07-28 09:00:00',
    end_datetime:'2021-07-28 17:00:00',
    company:"Amazon2",
    job_type_name:"Warehouse worker",
    max_approval_timestamp:"1630183430"
  }
];

const upcomingShiftsArray = [
  {
    id:2,
    hourly_wage:1350,
    start_datetime:'2021-07-30 09:00:00',
    end_datetime:'2021-07-30 17:00:00',
    company:"Escapade festival",
    job_type_name:"Event worker"
  }
];


let currentTimeout = null;

export default function AccountScreen({navigation, route, goToNotifications}) {

  const [username, setUsername] = React.useState("");
  const [timezoneOffset, setTimezoneOffset] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentOffers, setCurrentOffers] = React.useState([]);
  const [upcomingShifts, setUpcomingShifts] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    refreshPage();
  }, []);

  const refreshPage = () =>{
    setRefreshing(true);
    setRefreshing(false);
  }

  React.useEffect(()=>{
    if(currentTimeout != null){
      clearTimeout(currentTimeout);
      currentTimeout = null;
    }
  
    if(currentOffers.length > 0){
      let closestMaxTime = Number(currentOffers[0].max_approval_timestamp)*1000;
      let currentTime = new Date().getTime();
      for(let i=1;i<currentOffersArray.length;i++){
        let maxTime = Number(currentOffersArray[i].max_approval_timestamp)*1000;
        if(maxTime > currentTime && maxTime < closestMaxTime){
          closestMaxTime = maxTime;
        }
      }
      let deltaTime = closestMaxTime - currentTime;
      if(deltaTime > 0){
       currentTimeout = setTimeout(()=>{
          checkValidCurrentOffers();
        }, deltaTime+1000);
      }
    }
  }, [currentOffers]);

  const checkValidCurrentOffers = () =>{
    const newOffers = currentOffers.filter(offer=> new Date().getTime() < Number(offer.max_approval_timestamp)*1000);
    setCurrentOffers([...newOffers]);
  }

  React.useEffect(() => {
    setCurrentOffers([...currentOffersArray]);
    setUpcomingShifts([...upcomingShiftsArray]);
  }, []);

  async function getUsername(){
    const usernameValue = await AsyncStorage.getItem('username');
    setUsername(usernameValue);
  }

  useEffect(()=>{
    getUsername();
    setTimeout(async () => {
       setTimezoneOffset(await Number(AsyncStorage.getItem('timezone')))
    }, 1);
  }, []);

  let currentOffersRendered = null;
  if(currentOffers.length>0){
    currentOffersRendered = currentOffers.map((value, key)=>{
      return (
        <TouchableWithoutFeedback key={key} onPress={()=>{navigation.navigate("shiftDetailsScreen", {id:value.id})}}>
          <View style={[styles.shiftCard, {marginBottom:key == currentOffers.length - 1 ? 20:10}]}>
            <View style={styles.cardTop}>
              <View style={styles.cardTopLeft}>  
                <Text style={[globalStyle.title2]}>{value.job_type_name}</Text>
                <Text style={[globalStyle.regularText]}>{value.company}</Text>
              </View>
              <Image style={{height:30, width:30}} source={require("../../assets/icons/right-arrow.png")}/>
            </View>
            <View style={styles.cardBottom}>
              <Text style={[globalStyle.title2]}>{moneyParser(value.hourly_wage)}/hr</Text>
              <Text style={[globalStyle.regularText]}>{scheduleParser(value.start_datetime, value.end_datetime)}</Text>
              <View style={styles.progressBarContainer}>
                <CardBarTimer max_approval_timestamp={value.max_approval_timestamp} />
              </View>
              <View style={styles.cardButtonContainer}>
                <TouchableWithoutFeedback onPress={()=>{alert("Accept")}}>
                  <View style={[{marginRight:20, paddingHorizontal:25, paddingVertical:10, backgroundColor:"green", borderRadius:50}]}><Text style={[globalStyle.regularText, {color:"white"}]}>Accept</Text></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{alert("Decline")}}>
                  <Text style={[globalStyle.regularText, {color:"red"}]}>Decline</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }

  let upcomingShiftsRendered = null;
  if(upcomingShifts.length>0){
    let cardsShifts = upcomingShifts.map((value, key)=>{
      return (
        <TouchableWithoutFeedback key={key} onPress={()=>{navigation.navigate("shiftDetailsScreen", {id:value.id})}}>
          <View style={[styles.shiftCard]}>
            <View style={styles.cardTop}>
              <View style={styles.cardTopLeft}>  
                <Text style={[globalStyle.title2]}>{value.job_type_name}</Text>
                <Text style={[globalStyle.regularText]}>{value.company}</Text>
              </View>
              <Image style={{height:30, width:30}} source={require("../../assets/icons/right-arrow.png")}/>
            </View>
            <View style={styles.cardBottom}>
              <Text style={[globalStyle.title2]}>{moneyParser(value.hourly_wage)}/hr</Text>
              <Text style={[globalStyle.regularText]}>{scheduleParser(value.start_datetime, value.end_datetime)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });

    upcomingShiftsRendered = (
      <View style={{paddingTop:0}}>
        <Text style={[globalStyle.title2, {marginBottom:10}]}>Upcoming shifts</Text>
        {cardsShifts}
      </View>
    );
  }


  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <Text style={[globalStyle.title1, {marginBottom:5}]}>Good evening 👋</Text>
            <Text style={[globalStyle.regularText]}>You earned <Text style={[globalStyle.regularTextBold]}>$200.05</Text> this week</Text>
        </View>
        <View style={styles.innerContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />}>
            <View style={styles.cardsMainContainer}>
              {currentOffersRendered}
              {upcomingShiftsRendered}
            </View>
          </ScrollView>  
        </View>      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuOverlay:{
    position:"absolute",
    height:"100%",
    width:"100%",
    left:"100%",
    top:Platform.OS === "android" ? StatusBar.currentHeight:0,
    backgroundColor:"white",
    zIndex:2,
    elevation:3
  },
  floatingButton:{
    width:60,
    height:60,
    borderRadius:100,
    backgroundColor:"white",
    elevation:2,
    position:"absolute",
    bottom:10,
    right:10,
    zIndex:1,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
  },
  cardsMainContainer:{
    backgroundColor:"transparent",
    flex:1,
    padding:20
  },
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    flex: 1,
  },
  innerContainer:{
    flex:1,
    alignSelf:"stretch",
    paddingBottom:55,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollView:{
    width:"100%",
    height:"100%",
  },
  topBar:{
    backgroundColor:"white",
    padding:20,
    elevation:3,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10
  },
  shiftCard:{
    backgroundColor:"white",
    borderRadius:10,
    elevation:2,
    marginBottom:10,
    overflow:"hidden"
  },
  cardBottom:{
    padding:10
  },
  cardTop:{
    padding:10,
    backgroundColor:"#d3eee1",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  cardTopLeft:{
    flex:1
  },
  cardButtonContainer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    paddingTop:10
  },

  progressBarContainer:{
    backgroundColor:"transparent",
    flex:1,
    paddingBottom:10,
    width:"100%",
    paddingTop:20
  },
  progressBarBackground:{
    height:7.5,
    width:"100%",
    borderRadius:100,
    backgroundColor:"rgba(0,0,0,0.15)",
    overflow:"hidden"
  },
  progressBarMoving:{
    height:"100%",
    left:0,
    position:"absolute",
    top:0,
    backgroundColor:"blue"
  }
});
