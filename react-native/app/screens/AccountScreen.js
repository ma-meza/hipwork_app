import React, {useEffect} from 'react';
import { StyleSheet, StatusBar, Platform,Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const globalStyle = require('../../assets/style/globalStyle');





export default function AccountScreen({navigation, route, toggleNotificationsScrolling}) {
  const {signOut} = React.useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [coinsQty, setCoinsQty] = React.useState(0);

  async function getUsername(){
    const usernameValue = await AsyncStorage.getItem('username');
    setUsername(usernameValue);
  }

  useEffect(()=>{
    getUsername();
    axios.get(window.api_prefix+"/getProfile").then(resp=>{
      if(resp.data.success == true){
        setCoinsQty(resp.data.coinsQty);
      }
    });
  }, []);


  useEffect(()=>{
    const onfocus = navigation.addListener('focus', () => {
      toggleNotificationsScrolling(false);
    });
    const onblur = navigation.addListener('blur', () => {
      toggleNotificationsScrolling(true);
    });
  }, [navigation]);
  return (
      <SafeAreaView style={styles.container}>
        <View style={{flexDirection:"column",elevation:3, borderBottomLeftRadius:10, borderBottomRightRadius:10, paddingBottom:10, alignItems:"flex-start", justifyContent:"center", backgroundColor:"white", alignSelf:"stretch"}}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-start", paddingHorizontal:20, paddingVertical:10}}>
              <Image style={styles.profilePic}/>
              <Text style={[globalStyle.title2]}>Marc-Andre Meza</Text>
            </View>
            {/* <Text style={[globalStyle.regularText, {marginLeft:65}]}><Text style={globalStyle.regularTextBold}>38</Text> shifts</Text> */}
          </View>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={{flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingBottom:30, paddingTop:30}}>
          
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("shiftHistoryScreen")}}>
                  <View style={[styles.menuLinkContainer,{borderTopWidth:1}]}>
                    <Image source={require("../../assets/icons/history.png")} style={{height:25, width:25, marginRight:10}} />
                    <Text style={[globalStyle.regularText, {flex:1}]}>Shifts history</Text>
                    <Image source={require("../../assets/icons/right-arrow.png")} style={{height:25, width:25}} />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("availabilitiesScreen")}}>
                  <View style={[styles.menuLinkContainer]}>
                    <Image source={require("../../assets/icons/calendar.png")} style={{height:25, width:25, marginRight:10}} />
                    <Text style={[globalStyle.regularText, {flex:1}]}>Availabilities</Text>
                    <Image source={require("../../assets/icons/right-arrow.png")} style={{height:25, width:25}} />
                  </View>
                </TouchableNativeFeedback>
                {/* <View style={styles.menuLinkContainer}>
                  <Text style={[globalStyle.regularText, {flex:1}]}>Join existing group</Text>
                  <Image source={require("../../assets/icons/left-arrow.png")} style={{height:25, width:25}} />
                </View> */}
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("workProfileScreen")}}>
                  <View style={styles.menuLinkContainer}>
                    <Image source={require("../../assets/icons/edit.png")} style={{height:25, width:25, marginRight:10}} />
                    <Text style={[globalStyle.regularText, {flex:1}]}>Work profile</Text>
                    <Image source={require("../../assets/icons/right-arrow.png")} style={{height:25, width:25}} />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("paymentsScreen")}}>
                  <View style={[styles.menuLinkContainer]}>
                    <Image source={require("../../assets/icons/dollar-sign.png")} style={{height:25, width:25, marginRight:10}} />
                    <Text style={[globalStyle.regularText, {flex:1}]}>Payments</Text>
                    <Image source={require("../../assets/icons/right-arrow.png")} style={{height:25, width:25}} />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("settingsScreen")}}>
                  <View style={[styles.menuLinkContainer, {marginBottom:140}]}>
                    <Image source={require("../../assets/icons/settings.png")} style={{height:25, width:25, marginRight:10}} />
                    <Text style={[globalStyle.regularText, {flex:1}]}>Settings</Text>
                    <Image source={require("../../assets/icons/right-arrow.png")} style={{height:25, width:25}} />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{signOut();}}>
                  <View style={[styles.menuLinkContainer, {borderTopWidth:1, marginBottom:20}]}>
                    <Image source={require("../../assets/icons/sign-out.png")} style={{height:25, width:25, marginRight:10}} />
                    <Text style={[globalStyle.regularText, {flex:1}]}>Logout</Text>
                    <Image source={require("../../assets/icons/right-arrow.png")} style={{height:25, width:25}} />
                  </View>
                </TouchableNativeFeedback>
                <Text style={[globalStyle.regularText, {color:"rgba(0,0,0,0.6)"}]}>Version 1.0.2</Text>
              </View>
            </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuLinkContainer:{
    backgroundColor:"white",
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    paddingVertical:20,
    paddingHorizontal:20,
    alignSelf:"stretch",
    borderBottomWidth:1,
    borderColor:"rgba(0,0,0,0.1)"
  },
  profilePic:{
    width:35,
    height:35,
    backgroundColor:"grey",
    borderRadius:100,
    marginRight:10
  },
  scrollView:{
    width:"100%",
    height:"100%",
    backgroundColor:"rgba(0,0,0,0.04)"
  },
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    paddingBottom:55,
    flex: 1,
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  profileImage:{
    height:35,
    width:35,
    borderColor:"black",
    borderWidth:2,
    marginRight:10,
    borderRadius:100
  },
  iconImage:{
    height:25,
    width:25,
    marginRight:10
  }
});
