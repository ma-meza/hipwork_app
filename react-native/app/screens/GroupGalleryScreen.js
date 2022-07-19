import React, {useEffect} from 'react';
import axios from "axios";
import { StyleSheet, Text, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback } from 'react-native';
const globalStyle = require('../../assets/style/globalStyle');
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

var groupByDates = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export default function FullPageScreen({navigation, route}) {
  const [pictures, setPictures] = React.useState([]);
  const [ownPictures, setOwnPictures] = React.useState([]);


  useEffect(()=>{
    axios.get(window.api_prefix+"/groupGallery?groupId="+route.params.id).then(resp=>{
      if(resp.data.success==true){
        let grouppedObj = groupByDates(resp.data.pictures, "challenge_start_timestamp");

        let grouppedArray = [];
        for (const property in grouppedObj) {
          let dateValue = new Date(property*1000);
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
          grouppedArray.push({pictures:grouppedObj[property], dateString, challengeTimestamp:property});
        }
        grouppedArray.reverse();
        setPictures(grouppedArray);
        setOwnPictures(resp.data.ownPictures.map(value=>{
          return value.start_timestamp;
        }));
      }
    }).catch(err=>{

    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableNativeFeedback onPress={()=>{navigation.navigate("homeScreen", {refresh:true})}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Image style={styles.groupPicture} />
            <Text style={[globalStyle.title2, {alignSelf:"stretch", flex:1}]}>{route.params.groupName}</Text>
            <TouchableWithoutFeedback onPress={()=>{navigation.navigate("groupSettingsScreen", {groupName:route.params.groupName, groupId:route.params.id})}}>
              <Image source={require("../../assets/icons/kebab-horizontal.png")} style={{width:25, height:25, transform:[{rotate:"90deg"}]}}/>
            </TouchableWithoutFeedback>
        </View>
        <ScrollView style={styles.contentContainer}>
          {
            pictures.map((value, key)=>{
              let userHasAccessToThatDate = false;
              if(ownPictures.indexOf(Number(value.challengeTimestamp)) != -1){
                userHasAccessToThatDate = true;
              }
              return (
                <TouchableWithoutFeedback key={key} onPress={()=>{
                  if(userHasAccessToThatDate){
                    navigation.navigate("slideshowScreen", {pictures:pictures[key], groupName:route.params.groupName, dateString:pictures[key].dateString, challengeTimestamp:pictures[key].challengeTimestamp, groupId:route.params.id});
                  }else{
                    Alert.alert("Oh oh","Since you did't send that day's picture on time, you don't have access to what your friends have sent.", [{text:"Ok"}, {text:"Unlock pictures", onPress:()=>{alert("unlock")}}], {cancelable:true});
                  }
                }}>
                    <View style={{flex:1, marginBottom:20}}>
                      <View style={styles.dateTextContainer}>
                        <Text style={styles.regularText}><Text style={[globalStyle.title2]}>{value.dateString}</Text>{userHasAccessToThatDate?"":" • ❌missed"}</Text>
                      </View>
                      <View style={styles.picturesContainer}>
                        {
                          value.pictures.map((picture, key2)=>{
                            return (
                              <Image blurRadius={userHasAccessToThatDate?0:5} key={key+" "+key2} source={{uri:picture.url}} style={styles.pictureTile}/>
                            );
                          })
                        }
                      </View>
                    </View>
                </TouchableWithoutFeedback>
              );
            })
          }
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  picturesContainer:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"flex-start",
  },
  pictureTile:{
    width:"25%",
    aspectRatio:1,
    borderRadius:7,
    borderWidth:1,
    borderColor:"white"
  },
  dateTextContainer:{
    flex:1, 
    paddingHorizontal:20,
    paddingVertical:10
  },
    groupPicture:{
        height:35,
        width:35,
        borderRadius:100,
        backgroundColor:"grey",
        marginRight:10
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    width:"100%",
    backgroundColor:"#f4f4f4",
    justifyContent:"flex-start",
    alignItems:"center",
    paddingHorizontal:15,
    paddingVertical:15,
    flexDirection:"row",
    borderBottomColor:"#e9e9e9",
    borderBottomWidth:1
  },
  arrowImage:{
      height:30,
      width:30,
      marginRight:10
  },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      alignSelf:"stretch",
      flex:1
  }
});
