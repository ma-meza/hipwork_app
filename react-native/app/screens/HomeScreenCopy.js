import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const zeroFormatter = (num) =>{
  if(Number(num)<9){
    return "0"+num;
  }else{
    return num;
  }
}

export default function HomeScreen({navigation, route, goToNotifications}) {
  const [username, setUsername] = React.useState("");
  const [groups, setGroups] = React.useState([]);
  const [timezoneOffset, setTimezoneOffset] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getGroups(()=>{
      setRefreshing(false);
    });
  }, []);

  let groupTapCount = 0;

  async function getUsername(){
    const usernameValue = await AsyncStorage.getItem('username');
    setUsername(usernameValue);
  }


  const getGroups = (cb) =>{
    let todayMorning00 = new Date();
    todayMorning00.setMinutes(0);
    todayMorning00.setHours(0);
    todayMorning00.setSeconds(0);

    let todayMidnight = new Date();
    todayMidnight.setMinutes(59);
    todayMidnight.setHours(23);
    todayMidnight.setSeconds(0);

    let lowerLimitDate = Math.floor((todayMorning00.getTime() / 1000));
    let higherLimitDate = Math.floor((todayMidnight.getTime() / 1000));

    axios.get(window.api_prefix+"/userGroupsList?lowerLimitDate="+lowerLimitDate+"&higherLimitDate="+higherLimitDate).then(resp=>{
      console.log(resp.data);
      if(resp.data.success==true){
        setGroups(resp.data.groups);
        cb();
      }
    }).catch(err=>{
      cb();
    });
  }

  let backTimer;

  useEffect(()=>{
    getUsername();
    getGroups(()=>{});
    setTimeout(async () => {
       setTimezoneOffset(await Number(AsyncStorage.getItem('timezone')))
    }, 1);
  }, []);

  const handleGroupTap = (groupKey, pictureIsAllowed) =>{
    if(!pictureIsAllowed){
      clearTimeout(backTimer);
      navigation.navigate("groupPhotoGalleryScreen", {id:groups[groupKey].group_id, groupName:groups[groupKey].name});
      return;
    }
    groupTapCount++;
    if (groupTapCount == 2) {
      clearTimeout(backTimer);
      groupTapCount = 0;
      navigation.navigate("selfieScreen", {id:groups[groupKey].group_id, groupName:groups[groupKey].name, key:groupKey});
    } else {
      backTimer = setTimeout(()=>{
        groupTapCount = 0;
        navigation.navigate("groupPhotoGalleryScreen", {id:groups[groupKey].group_id, groupName:groups[groupKey].name});
      }, 450);
    }
  }

  return (
        <SemiFullPageScreen>
          <View style={{backgroundColor:"#f4f4f4", flex:1, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, paddingHorizontal:20, flexDirection:"row", alignItems:"center", justifyContent:"flex-end"}}>
            {/* <View style={styles.sectionView}>
              <Text style={[globalStyle.title1, {color:"black"}]}>Good evening, {"\n"}{username} 👋</Text>
            </View> */}
            <Image style={{height:30, width:30, tintColor:"transparent"}} source={require("../../assets/icons/bell.png")}/>
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Home</Text>
            <TouchableWithoutFeedback onPress={()=>{goToNotifications()}}>
              <Image style={{height:30, width:30, tintColor:"#ebc934"}} source={require("../../assets/icons/bell.png")}/>
            </TouchableWithoutFeedback>
          </View>
          <ScrollView style={styles.sectionViewNoPadding}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
            {
              groups.map((groupInfo, key)=>{
                let pictureIsAllowed = false;
                let startTimestamp = groupInfo.start_timestamp;
                let endTimestamp = groupInfo.start_timestamp + 600; // +10 minutes in seconds
                let nowTimestamp = Math.floor(new Date().getTime() / 1000);
                let pictureStatusString = "";
                if(nowTimestamp < startTimestamp){
                  //picture time is not yet
                }else if(nowTimestamp > endTimestamp){
                  //picture time has passed
                  if(groupInfo.url == null){
                    pictureStatusString = "❌ You've missed today's picture";
                  }else{
                    pictureStatusString = "✔️ You've sent today's pic";
                  }
                }else{
                  //picture is allowed
                  if(groupInfo.url == null){
                    pictureIsAllowed = true;
                    let minutesRemaining = Math.floor((endTimestamp - nowTimestamp) / 60000);
                    pictureStatusString = "⏳ "+minutesRemaining+"min remaining for today's pic";
                  }else{
                    pictureStatusString = "✔️ You've sent today's pic";
                  }
                }
                return (
                  <TouchableNativeFeedback key={key} onPress={()=>{handleGroupTap(key, pictureIsAllowed)}}>
                    <View style={styles.groupTabMainContainer}>
                      <View style={styles.groupTab}>
                        <Image style={styles.groupPicture}/>
                        <View style={{flex:1, flexDirection:"column"}}>
                          <Text style={[globalStyle.regularTextBold]}>{groupInfo.name}</Text>
                          {pictureStatusString.length>0?<Text style={[globalStyle.regularText]}>{pictureStatusString}</Text>:null}
                        </View>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                );
              })
            }
          </ScrollView>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
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
  traderInfoContainer:{
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    marginBottom:10
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
    paddingBottom:20,
    paddingTop:10,

  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTab:{
    flex:1,
    paddingVertical:20,
    paddingHorizontal:0,
    borderBottomColor:"#e1e1e1",
    borderBottomWidth:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
    },
  groupTabMainContainer:{
    flex:1,
    paddingHorizontal:20
  },
  groupPicture:{
    height:45,
    width:45,
    borderRadius:100,
    backgroundColor:"grey",
    marginRight:10
  }
});
