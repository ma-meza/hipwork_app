import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, TextInput, Text, View, Image,TouchableWithoutFeedback, TouchableNativeFeedback, ScrollView} from 'react-native';
import Dialog from "react-native-dialog";
import SemiFullPageScreen from "./SemiFullPageScreenType";
import axios from "axios";
export default function HomeScreen({navigation, route}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isNamePromptActive, setIsNamePromptActive] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState("");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);



  useEffect(()=>{
      
  }, []);

  const leaveGroup = () =>{
    axios.post(window.api_prefix+"/leaveGroup", {groupId:route.params.groupId}).then(resp=>{
      if(resp.data.success==true){
        navigation.navigate("homeScreen", {refresh:true});
      }
    }).catch();
  }

  const showEditGroupNamePrompt = () =>{
    setIsNamePromptActive(true);
  }

  const editGroupName =()=>{
    if(newGroupName.length>0){
      navigation.setParams({
        groupName:newGroupName
      });
      setIsNamePromptActive(false);
      axios.post(window.api_prefix+"/editGroupName", {groupId:route.params.groupId, newName:newGroupName}).then().catch();
    }
  }

  const hidePrompt = () =>{
    setIsNamePromptActive(false);
    setNewGroupName("");
  }

  return (
        <SemiFullPageScreen>
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.navigate("groupPhotoGalleryScreen", {groupName:route.params.groupName, id:route.params.id})}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Group Settings</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
          </View>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingTop:30, paddingHorizontal:20 }}>
                <Image style={styles.profilePic}/>
                <TouchableNativeFeedback onPress={showEditGroupNamePrompt}>
                  <Text style={[globalStyle.title2, {marginBottom:20}]}>{route.params.groupName}</Text>
                </TouchableNativeFeedback>
              </View>
              <TouchableNativeFeedback onPress={()=>{navigation.navigate("seeGroupMembersScreen", {groupId:route.params.groupId})}}>
                  <View style={styles.menuLinkContainer}>
                    <Text style={[globalStyle.regularText, {flex:1}]}>See/remove group members</Text>
                    <Image source={require("../../assets/icons/left-arrow.png")} style={{height:25, width:25, transform:[{rotate:"180deg"}]}} />
                  </View>
                </TouchableNativeFeedback>
                {/* <View style={styles.menuLinkContainer}>
                  <Text style={[globalStyle.regularText, {flex:1}]}>Join existing group</Text>
                  <Image source={require("../../assets/icons/left-arrow.png")} style={{height:25, width:25, transform:[{rotate:"180deg"}]}} />
                </View> */}
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("groupAddMembersScreen", {groupId:route.params.groupId})}}>
                  <View style={styles.menuLinkContainer}>
                    <Text style={[globalStyle.regularText, {flex:1}]}>Add new members</Text>
                    <Image source={require("../../assets/icons/left-arrow.png")} style={{height:25, width:25, transform:[{rotate:"180deg"}]}} />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{navigation.navigate("settingsScreen")}}>
                  <View style={[styles.menuLinkContainer, {marginBottom:140}]}>
                    <Text style={[globalStyle.regularText, {flex:1}]}>Account settings</Text>
                    <Image source={require("../../assets/icons/left-arrow.png")} style={{height:25, width:25, transform:[{rotate:"180deg"}]}} />
                  </View>
                </TouchableNativeFeedback>
                <TouchableWithoutFeedback onPress={leaveGroup}>
                  <View style={styles.menuLinkContainer}>
                    <Text style={[globalStyle.regularText, {flex:1}]}>Leave group</Text>
                    <Image source={require("../../assets/icons/left-arrow.png")} style={{height:25, width:25, transform:[{rotate:"180deg"}]}} />
                  </View>
                </TouchableWithoutFeedback>
          </ScrollView>
          <Dialog.Container visible={isNamePromptActive} onBackdropPress={hidePrompt}>
            <Dialog.Title>Edit group name</Dialog.Title>
            {/* <Dialog.Description>
              Do you want to delete this account? You cannot undo this action.
            </Dialog.Description> */}
            <TextInput value={newGroupName} placeholder={"Group name"} onChangeText={setNewGroupName} style={{borderWidth:1, borderColor:"rgba(0,0,0,0.8)", paddingHorizontal:10, paddingVertical:10, borderRadius:10}}/>
            <Dialog.Button label="Cancel" onPress={hidePrompt}/>
            <Dialog.Button label="Set name" onPress={editGroupName}/>
        </Dialog.Container>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  menuLinkContainer:{
    backgroundColor:"white",
    borderRadius:5,
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    paddingVertical:20,
    paddingHorizontal:20,
    marginBottom:20,
    alignSelf:"stretch",
    // borderColor:"#e9e9e9",
    borderColor:"black",
    borderWidth:1
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
  },
  profilePic:{
    width:100,
    height:100,
    backgroundColor:"grey",
    borderRadius:100,
    marginBottom:20
  },
  sectionDivisor:{
    width:"100%",
    height:40
  }, 
  scrollView:{
    width:"100%",
    height:"100%",
    paddingHorizontal:20
  },
  topContainer:{
    width:"100%",
    borderWidth:2,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderTopWidth:0,
    borderBottomColor:"#e1e1e1",
    borderBottomWidth:1,
    height:60,
    paddingLeft:10,
    justifyContent:"center",
    marginBottom:10,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  rowsContainer:{
    width:"100%",
    paddingLeft:10,
    justifyContent:"center",
    height:60,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
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
