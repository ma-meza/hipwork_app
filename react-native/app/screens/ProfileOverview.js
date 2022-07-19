import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button } from 'react-native';
import FullPageScreen from "./FullPageScreenType";
import globalStyle from "../../assets/style/globalStyle";
import CustomButton from "../components/button";
import * as WebBrowser from 'expo-web-browser';
import axios from "axios";



export default function WelcomeScreen({navigation, route}) {
  const groupId = route.params.id;
  const [userObject, setUserObject] = useState({});
  useEffect(()=>{
    axios.get(window.api_prefix+"/userProfileFromId?id="+groupId).then(resp=>{
      setUserObject(resp.data);
    }).catch();
  }, []);

  let registrationDate = new Date(userObject.signupdate).getMonth()+",  "+new Date(userObject.signupdate).getFullYear();
  registrationDate = "March, 2021";
  return (
      <FullPageScreen pageName={""} navigation={navigation}>
          <View style={[styles.contentSection, {flexDirection:"row", alignItems:"center", justifyContent:"flex-start"}]}>
            <View style={styles.profilePictureContainer}></View>
            <View style={{flexDirection:"column"}}>
                <Text style={[globalStyle.title2]}>@{userObject.name}</Text>
                <Text style={[globalStyle.regularText, {marginBottom:10}]}>Member since {registrationDate}.</Text>
            </View>
          </View>
          <View style={[styles.contentSection, {marginBottom:100}]}>
            <Text style={[globalStyle.regularText, {marginBottom:10}]}><Text style={globalStyle.regularTextBold}>{userObject.qtitymembers}</Text> subscribers</Text>
            <Text style={[globalStyle.regularText, {marginBottom:20}]}>{userObject.bio}</Text>
            <CustomButton title={"Subscribe ($"+userObject.membershipprice+"/mo)"} onPress={async ()=>{await WebBrowser.openBrowserAsync('https://google.com');}} style={{marginBottom:5}}/>
            <Text style={[globalStyle.regularText, {color:"#a1a1a1", textAlign:"center"}]}>You'll be able to review your purchase on the next screen.</Text>
          </View>
          <View style={[styles.contentSection, {flex:1, alignItems:"center", justifyContent:"center"}]}>
            <Image style={{width:100, height:100, marginBottom:20}} tintColor="#a1a1a1" source={require("../../assets/icons/lock-big.png")}/>
            <Text style={[globalStyle.regularText, {color:"#a1a1a1",  marginBottom:10}]}>{userObject.qtitysignals} signals • {userObject.qtityposts} posts • {userObject.qtitychats} chats</Text>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                <View style={{backgroundColor:"green", paddingHorizontal:10, paddingVertical:5,borderRadius:10, marginRight:5}}>
                    <Text style={[globalStyle.regularTextBold, {color:"white"}]}>{userObject.traderscore}</Text>
                </View>
                <Text style={[globalStyle.regularTextBold]}>score</Text>
            </View>
          </View>     
      </FullPageScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection:{
    paddingLeft:15,
    paddingRight:15,
    marginBottom:15
  },
  profilePictureContainer:{
      height:70,
      width:70,
      borderColor:"black",
      borderWidth:1,
      marginRight:10,
      borderRadius:100
  }
});
