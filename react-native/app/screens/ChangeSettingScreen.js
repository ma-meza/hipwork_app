import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, TouchableNativeFeedback, Button, ScrollView, TextInput } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";

export default function HomeScreen({navigation, route, goToHome}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [textValue, setTextValue] = React.useState("");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);



  useEffect(()=>{
      
  }, []);

  let pageTitle = "Set username";
  let pageContent = (
      <View style={{paddingHorizontal:20, paddingTop:20}}>
            <Text style={[globalStyle.regularText, {marginBottom:10}]}>Pick a new username for your profile</Text>
            <TextInput style={[styles.inputText, globalStyle.regularText]} placeholder="new username" value={textValue} onChange={setTextValue}/>
            <View style={styles.submitButton}><Text style={[{color:"white"}, globalStyle.regularTextBold]}>save</Text></View>
      </View>
  );
  if(route.params.type == "phone"){
    pageTitle = "Set phone";
    pageContent = (
        <View style={{paddingHorizontal:20, paddingTop:20}}>
            <Text style={[globalStyle.regularText, {marginBottom:10}]}>Set a new phone number for your profile</Text>
            <TextInput style={[styles.inputText, globalStyle.regularText]} placeholder="new phone number" keyboardType={"phone-pad"} value={textValue} onChange={setTextValue}/>
            <View style={styles.submitButton}><Text style={[{color:"white"}, globalStyle.regularTextBold]}>save</Text></View>
        </View>
    );
  }else if(route.params.type == "password"){
    pageTitle = "Set password";
    pageContent = (
        <View style={{paddingHorizontal:20, paddingTop:20}}>
            <Text style={[globalStyle.regularText, {marginBottom:10}]}>Set a new password for your profile</Text>
            <TextInput style={[styles.inputText, globalStyle.regularText]} placeholder="new password" value={textValue} onChange={setTextValue}/>
            <View style={styles.submitButton}><Text style={[{color:"white"}, globalStyle.regularTextBold]}>save</Text></View>
        </View>
    );
  }else if(route.params.type == "profilePic"){
      pageTitle = "Set picture";
      pageContent = (null);
  }

  return (
        <SemiFullPageScreen>
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>{pageTitle}</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
          </View>
          <ScrollView style={styles.sectionViewNoPadding}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
                {pageContent}
          </ScrollView>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  sectionContainer:{
    borderBottomWidth:1,
    borderBottomColor:"#e9e9e9",
    paddingVertical:15,
    paddingHorizontal:20,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
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
    paddingBottom:20
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
  },
  inputText:{
      borderWidth:1,
      borderColor:"black",
      borderRadius:10,
      padding:10,
      marginBottom:20
  },
  submitButton:{
    backgroundColor:"#0c8881",
    borderRadius:100,
    paddingVertical:10,
    paddingHorizontal:20,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"center",
    alignSelf:"flex-start"
  }
});
