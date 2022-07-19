import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, ActivityIndicator, Dimensions, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native';


import { LinearGradient } from 'expo-linear-gradient';
import ChatScreen from "./ChatScreen";
import axios from "axios";
import Swiper from "react-native-swiper";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

const globalStyle = require('../../assets/style/globalStyle');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FullPageScreen({navigation, route}) {
  const [pictures, setPictures] = React.useState([]);
  const [activePictureIndex, setActivePictureIndex] = React.useState(0);
  const [isSwipeActive, setIsSwipeActive] = React.useState(true);
  const [groupName, setGroupName] = React.useState("");
  const [dateString, setDateString] = React.useState("");
  const verticalSwiperRef = React.useRef();
  const [isLoading, setIsLoading] = React.useState(false);



  useEffect(()=>{
      if(route.params.pictures && route.params.pictures.pictures && route.params.groupName){
        setPictures(route.params.pictures.pictures);
        setGroupName(route.params.groupName);
      }else{
        setIsLoading(true);
        axios.get(window.api_prefix+"/getChallengeInfos?groupId="+route.params.groupId+"&timestamp="+route.params.challengeTimestamp).then(resp=>{
          if(resp.data.success == true){
            setPictures(resp.data.pictures);
            setGroupName(resp.data.groupInfo.name?resp.data.groupInfo.name:"");
            setIsLoading(false);
          }
        }).catch(err=>{
          setIsLoading(false);
        });
      }

      if(route.params.dateString){
        setDateString(route.params.dateString);
      }else{
        let dateValue = new Date(route.params.challengeTimestamp*1000);
        let nowDate = new Date();
        let dateString = "";
        if(nowDate.getFullYear() == dateValue.getFullYear() && nowDate.getMonth() == dateValue.getMonth()){
          if(nowDate.getDate() == dateValue.getDate()){
            dateString = "Today";
          }else if((nowDate.getDate() - 1) == dateValue.getDate()){
            dateString = "Yesterday";
          }else{
            dateString = monthNames[(dateValue.getMonth())]+" "+dateValue.getDate()+", "+dateValue.getFullYear();
          }
        }else{
          dateString = monthNames[(dateValue.getMonth())]+" "+dateValue.getDate()+", "+dateValue.getFullYear();
        }
        setDateString(dateString);
      }
  }, []);


  useEffect(()=>{
    if(verticalSwiperRef.current){
      verticalSwiperRef.current.scrollTo({y:windowHeight, animated:false});
    }
  }, [isSwipeActive]);
  
  useEffect(()=>{
    if(verticalSwiperRef.current){
      verticalSwiperRef.current.scrollTo({y:0, animated:false});
    }
  }, [isLoading]);
  

  if(isLoading==true){
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if(pictures.length==0){
    return <View></View>
}

  

  return (
    <View style={{flex:1}}>
      {/* <StatusBar translucent backgroundColor="rgba(0,0,0,0.01)" translucent={true} /> */}
    <ScrollView nestedScrollEnabled={true} snapToInterval={windowHeight} scrollEnabled={isSwipeActive} decelerationRate={0.95} ref={verticalSwiperRef} index={0} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps='handled'>
          {isSwipeActive?
          <View style={{width:windowWidth, height:windowHeight, alignItems:"center", justifyContent:"center"}}>
              <LinearGradient style={styles.topBar} colors={['rgba(0,0,0,0.9)', 'transparent']}>
                  <View style={styles.topBarInner}>
                      <TouchableNativeFeedback onPress={()=>{navigation.goBack()}}>
                          <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
                      </TouchableNativeFeedback>
                      <Text style={[globalStyle.regularText, {color:"white"}]}><Text style={[globalStyle.regularTextBold]}>{groupName}</Text> • {dateString}</Text>
                  </View>
                  <View style={styles.topBarInner}>
                      <Image style={styles.userImage}/>
                      <Text style={[globalStyle.regularTextBold, {color:"white"}]}>{pictures[activePictureIndex].name}</Text>
                  </View>
              </LinearGradient>
                  <TouchableWithoutFeedback onPress={()=>{verticalSwiperRef.current.scrollTo({y:windowHeight, animated:true})}}>
                      <LinearGradient style={styles.bottomBar} colors={['transparent', 'rgba(0,0,0,0.6)']}>
                          <Image source={require("../../assets/icons/chevron-right.png")} style={{height:30, width:30, tintColor:"white", marginBottom:-5,transform:[{rotate:"270deg"}]}}/>
                          <Text style={[globalStyle.regularText, {color:"white"}]}>chat</Text>
                      </LinearGradient>
                  </TouchableWithoutFeedback>
              <Swiper loop={false} showsButtons={false} onIndexChanged={(index)=>{setTimeout(() => { setActivePictureIndex(index); }, 1)}} loadMinimal={true} loadMinimalSize={2}
              dot={<View style={{zIndex:15, backgroundColor:'black', width: 4, height: 4,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 0, marginBottom: 60,}} />}
              activeDot={<View style={{zIndex:15, backgroundColor:'red', width: 12, height: 4,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 0, marginBottom: 60,}} />}
              >
                  {
                      pictures.map((value, key)=>{
                          return (
                              <View key={key} style={[styles.horizontalSlide]}>
                                  <ImageBackground source={{uri:value.url}} resizeMode="cover" style={{flex:1}}></ImageBackground>
                              </View>
                          );
                      })
                  }
              </Swiper>
        </View>
        :
        null
          }
        <ChatScreen toggleMainScroll={(value)=>{setIsSwipeActive(value)}} scrollUp={()=>{verticalSwiperRef.current.scrollTo({y:0, animated:true})}} scrollToBottom={()=>{verticalSwiperRef.current.scrollTo({y:windowHeight*2, animated:false})}} onPress={()=>{verticalSwiperRef.current.scrollBy(-1, true)}} groupId={route.params.groupId} timestamp={route.params.challengeTimestamp}/>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    chatViewContainer:{
        width:"100%",
        height:"100%",
        position:"absolute",
        left:0,
        top:0,
        backgroundColor:"black",
        zIndex:3
    },
    horizontalSlide:{
        flex:1
    },
  picturesContainer:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"flex-start",
  },
  pictureTile:{
    width:"25%",
    aspectRatio:1,
    borderWidth:1,
    borderColor:"red"
  },
  dateTextContainer:{
    flex:1, 
    paddingHorizontal:20,
    paddingVertical:10
  },
    userImage:{
        height:35,
        width:35,
        borderRadius:100,
        backgroundColor:"grey",
        marginRight:10
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    justifyContent:"center",
    width:"100%",
    alignItems:"flex-start",
    paddingHorizontal:15,
    paddingVertical:15,
    flexDirection:"column",
    position:"absolute",
    top:0,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight+10:0,
    zIndex:2
  },
  bottomBar:{
    justifyContent:"center",
    width:"100%",
    alignItems:"center",
    paddingHorizontal:15,
    paddingVertical:15,
    flexDirection:"column",
    position:"absolute",
    bottom:0,
    zIndex:2
  },
  topBarInner:{
    justifyContent:"flex-start",
    alignItems:"center",
    alignSelf:"stretch",
    flexDirection:"row",
    marginBottom:10
  },
  arrowImage:{
      height:40,
      width:40,
      marginRight:10,
      tintColor:"white"
  },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      alignSelf:"stretch",
      flex:1
  }
});
