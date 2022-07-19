import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, Image, TouchableWithoutFeedback, ScrollView, BackHandler, TouchableNativeFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import axios from "axios";
import {timeElapsedCalculator} from "../../utils";
import { Constants } from 'expo-camera';


function parseStringToComponent(stringToRender) {
let splittedString = stringToRender.split("<%break%>");
return splittedString.map((value, key)=>{
  const tagValue = value.substring(0, 4);
  if(tagValue == "<b%>"){
    return <Text key={key} style={globalStyle.regularTextBold}>{value.substring(4, value.length)}</Text>
  }else{
    return value;
  }
});
}


export default function NotificationScreen({navigation, route, goToHome}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotifications(()=>{
      setRefreshing(false);
    });
  }, []);

  const answerFriendRequest = (notifKey, isApproved) =>{
    axios.post(window.api_prefix+"/answerFriendRequest", {isApproved, notifObj:notifications[notifKey]});
    let newNotifsArray = [...notifications];
    newNotifsArray.splice(notifKey, 1);
    setNotifications([...newNotifsArray]);
    return;
  }

  const getNotifications = (cb)=>{
    axios.get(window.api_prefix+"/getNotifications").then(resp=>{
      if(resp.data.success == true){
        setNotifications([...resp.data.notifications]);
      }else{
        setNotifications([]);
      }
      cb();
    }).catch(err=>{
      setNotifications([]);
      cb();
    })
  }

  useEffect(()=>{
    getNotifications(()=>{});
  }, []);

  let parsedNotifications = <Text>No notifications for now.</Text>
  if(notifications.length>0){
    parsedNotifications = notifications.map((value, key)=>{


      let relatedButtons = null;
    if(value.type==0){
      //friend request
      relatedButtons = (
        <View style={{flexDirection:"row", alignSelf:"stretch", paddingVertical:10, paddingHorizontal:10, alignItems:"center", justifyContent:"center"}}>
          <TouchableNativeFeedback onPress={()=>{answerFriendRequest(key, true)}}>
            <View style={[{marginRight:30}, styles.ctaStyle]}>
              <Text style={[globalStyle.regularText, {color:"white"}]}>Accept</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={()=>{answerFriendRequest(key, false)}}>
            <View style={styles.ctaStyle}>
              <Text style={[globalStyle.regularText, {color:"white"}]}>Decline</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }




      const onPressValue = () =>{
        const related_data = JSON.parse(value.related_data);
        if(value.type == 1){
          //new message
          navigation.navigate("slideshowScreen", {challengeTimestamp:related_data.challenge_start_timestamp, groupId:related_data.group_id});
        }else if(value.type == 2){
          //challenge recap
          navigation.navigate("slideshowScreen", {challengeTimestamp:related_data.challenge_start_timestamp, groupId:related_data.group_id});
        }else{
          return null;
        }
      }
      if(value.type == 0){
        return (
          <View key={key} style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
            <View style={{flexDirection:"row", paddingVertical:10, paddingHorizontal:10, alignItems:"flex-start", justifyContent:"flex-start"}}>
              <Image style={{width:40, height:40, backgroundColor:"red", borderRadius:100, marginRight:10}} />
              <Text style={[globalStyle.regularText, {lineHeight:22, flexShrink:1}]}>{parseStringToComponent(value.message)}{"\n"}<Text style={[{color:"#a1a1a1"}]}>{timeElapsedCalculator(value.timestamp)}</Text></Text>
            </View>
            {
              relatedButtons
            }
          </View>
        );
      }
      return (
        <TouchableNativeFeedback key={key} onPress={onPressValue}>
            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
              <View style={{flexDirection:"row", paddingVertical:10, paddingHorizontal:10, alignItems:"flex-start", justifyContent:"flex-start"}}>
                <Image style={{width:40, height:40, backgroundColor:"red", borderRadius:100, marginRight:10}} />
                <Text style={[globalStyle.regularText, {lineHeight:22, flexShrink:1}]}>{parseStringToComponent(value.message)}{"\n"}<Text style={[{color:"#a1a1a1"}]}>{timeElapsedCalculator(value.timestamp)}</Text></Text>
              </View>
            </View>
        </TouchableNativeFeedback>
      );
    });
  }

  return (
        <SemiFullPageScreen>
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            {/* <View style={styles.sectionView}>
              <Text style={[globalStyle.title1, {color:"black"}]}>Good evening, {"\n"}{username} 👋</Text>
            </View> */}
            <TouchableWithoutFeedback onPress={()=>{goToHome();}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Notifications</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
          </View>
          <ScrollView style={styles.sectionViewNoPadding}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
              {parsedNotifications}
          </ScrollView>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  ctaStyle:{
    backgroundColor:"#0c8881",
    borderRadius:10,
    paddingHorizontal:20,
    paddingVertical:10
  },
  greyText:{
    color:"#a1a1a1"
  },
  profilePicture:{
    width:40,
    height:40,
    borderColor:"black",
    borderWidth:1,
    borderRadius:100,
    marginRight:10
  },
  sectionViewNoPadding:{
    backgroundColor:"#fdfdfd",
    width:"100%",
    paddingBottom:20
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
