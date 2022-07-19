import React, {useEffect} from 'react';
import { StyleSheet, StatusBar, Platform,Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const globalStyle = require('../../assets/style/globalStyle');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]




export default function UserProfileScreen({navigation, route}) {
  const [username, setUsername] = React.useState("");
  const [signupDate, setSignupDate] = React.useState("");
  const [commonFriends, setCommonFriends] = React.useState([]);

  useEffect(()=>{
    axios.get(window.api_prefix+"/getProfile?id="+route.params.id).then(resp=>{
      if(resp.data.success == true){
        setUsername(resp.data.name);
        let signupDateTimestamp = new Date(resp.data.memberDate*1000);

        setSignupDate("Member since "+monthNames[signupDateTimestamp.getMonth()]+", "+signupDateTimestamp.getFullYear());
      }
    });
    axios.get(window.api_prefix+"/getCommonFriends?id="+route.params.id).then(resp=>{
        if(resp.data.success == true){
            setCommonFriends([...resp.data.friends]);
        }
    });
  }, []);

  let commonFriendsParsed = <Text style={[globalStyle.regularText]}>Looks like you don't have any friends in common:/</Text>;
  if(commonFriends.length>0){
    commonFriendsParsed = commonFriends.map((value, key)=>{
        return (
            <TouchableNativeFeedback key={key} onPress={()=>{navigation.push("userProfileScreen", {id:value.user_id})}}>
                <View style={{borderBottomWidth:1, borderBottomColor:"#a9a9a9", flex:1, paddingVertical:10, flexDirection:"row", alignItems:"center", justifyContent:"flex-start"}}>
                    <Image style={{height:35, width:35, backgroundColor:"red", borderRadius:100, marginRight:10}}/>
                    <Text style={[globalStyle.regularText]}>@{value.name}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    });
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={{backgroundColor:"#f4f4f4", borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center", alignSelf:"stretch"}}>
          {/* <View style={styles.sectionView}>
            <Text style={[globalStyle.title1, {color:"black"}]}>Good evening, {"\n"}{username} 👋</Text>
          </View> */}
          <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)"}]}>Profile</Text>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"flex-start", paddingTop:20, paddingHorizontal:20, marginBottom:20}}>
            <Image style={styles.profilePic}/>
            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"center"}}>
                <Text style={[globalStyle.title2, {marginBottom:5}]}>@{username}</Text>
                <Text style={[globalStyle.regularText, {marginBottom:10}]}>{signupDate}</Text>
                <TouchableNativeFeedback onPress={()=>{alert("ADD");}}>
                <View style={{backgroundColor:"#0c8881", borderRadius:100, paddingVertical:5, paddingHorizontal:15, alignItems:"center", flexDirection:"row", justifyContent:"center"}}>
                    <Text style={[{color:"white"}, globalStyle.regularTextBold]}>Request</Text>
                </View>
                </TouchableNativeFeedback>
            </View>
          </View>
          <View style={{backgroundColor:"#f4f4f4", borderBottomColor:"#e9e9e9", borderTopColor:"#e9e9e9",borderBottomWidth:1, borderTopWidth:1,paddingBottom:15}}></View>
          <View style={{flex:1, padding:20}}>
            <Text style={[globalStyle.title2, {marginBottom:10}]}>Friends in common</Text>
            {commonFriendsParsed}
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profilePic:{
    width:100,
    height:100,
    backgroundColor:"grey",
    borderRadius:100,
    marginRight:20
  },
  scrollView:{
    width:"100%",
    height:"100%"
  },
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    paddingBottom:65,
    flex: 1,
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  iconImage:{
    height:25,
    width:25,
    marginRight:10
  }
});
