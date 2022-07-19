import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, Image,TextInput,Dimensions, TouchableWithoutFeedback, ScrollView, TouchableNativeFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "axios";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomeScreen({navigation, route}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [nameSearch, setNameSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearchLoading, setIsSearchLoading] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsSearchLoading(true);
    searchFriends(()=>{
      setRefreshing(false);
    });
    
  }, []);


  const searchFriends = (cb) =>{
    axios.get(window.api_prefix+"/getFriendsNotInGroup?nameSearch="+nameSearch+"&groupId="+route.params.groupId).then(resp=>{
      if(resp.data.success == true){
        setSearchResults([...resp.data.users]);
        setIsSearchLoading(false);
        cb();
        return;
      }
      setSearchResults([]);
      cb();
      setIsSearchLoading(false);
      return;

    }).catch(err=>{
      setIsSearchLoading(false);
    });
  }

  useEffect(()=>{
    searchFriends(()=>{});
  }, []);

  useEffect(()=>{
    searchFriends(()=>{});
  }, [nameSearch]);

  const addToGroup = (userArrayKey) =>{
    const userId = searchResults[userArrayKey].user_id;
    const userName = searchResults[userArrayKey].name;

    axios.post(window.api_prefix+"/addMemberToGroup", {userId:userId, userName:userName, groupId: route.params.groupId}).then(resp=>{
   
    }).catch();

    let newSearchResults = [...searchResults];
    newSearchResults.splice(userArrayKey, 1);
    setSearchResults(newSearchResults);
  }


  const handleSearchTyping = (value)=>{
    setNameSearch(value);
  }

  let searchResultsRender = <Text>{isSearchLoading?"Loading...":"No results..."}</Text>
  if(searchResults.length>0){
    searchResultsRender = searchResults.map((value, key)=>{
      return (
        <View key={key} style={{paddingHorizontal:10, paddingVertical:15, borderBottomWidth:1, borderBottomColor:"#e9e9e9", flexDirection:"row", alignItems:"center"}}>
          <Image style={{height:35, width:35, backgroundColor:"red", borderRadius:100, marginRight:10}}/>
          <Text style={[globalStyle.regularText, {flex:1}]}>{value.name}</Text>
          <TouchableWithoutFeedback onPress={()=>{addToGroup(key)}}>
            <View style={{backgroundColor:"#0c8881", borderColor:"#0c8881", borderRadius:100, paddingVertical:5, paddingHorizontal:15, alignItems:"center", flexDirection:"row", justifyContent:"center"}}>
              <Text style={[{color:"white"}, globalStyle.regularTextBold]}>{"Add"}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    })
  }

  return (
        <SemiFullPageScreen>
          <View style={{height:windowHeight, width:windowWidth}}>
            <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
              <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
                <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
              </TouchableWithoutFeedback>            
              <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Add members</Text>
              <Image style={{height:30, width:30, tintColor:"transparent"}}/>
            </View>
            <View>
              <View style={{flexDirection:"row", alignItems:"center", paddingLeft:10}}>
                <Image source={require("../../assets/icons/search.png")} style={{height:20, width:20, tintColor:"#a1a1a1"}}/>
                <TextInput value={nameSearch} onChangeText={(value)=>{handleSearchTyping(value)}} style={[styles.textInput, globalStyle.regularText]} placeholder="Add friends to the group"/>
              </View>
              <View style={{backgroundColor:"#f4f4f4", paddingHorizontal:10, paddingVertical:10, borderTopColor:"#e9e9e9", borderBottomColor:"#e9e9e9", borderTopWidth:1, borderBottomWidth:1}}>
                <Text style={[globalStyle.regularTextBold]}>{nameSearch.length>0? "Search results":"Recommended friends"}</Text>
              </View>
            </View>
            <View style={{flex:1}}>
              <ScrollView style={styles.scrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                  {searchResultsRender}
              </ScrollView>
            </View>
          </View>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  textInput:{
    backgroundColor:"white",
    paddingHorizontal:10,
    paddingVertical:10,
    flex:1
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
  scrollView:{
    flex:1
  }
});
