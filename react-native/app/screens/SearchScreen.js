import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, Text, View, TextInput,SafeAreaView, TouchableHighlight, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, TouchableWithoutFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import axios from "axios";

let tradingTypes = ["forex", "stock", "crypto"];


export default function HomeScreen({navigation, route}) {

    const [search, setSearch] = useState("");
    const [trendingCommunities, setTrendingCommunities] = useState([]);
    const [trendingGroups, setTrendingGroups] = useState([]);
    
    
  useEffect(()=>{
    axios.get(window.api_prefix+"/trendingTopics").then((resp)=>{
      setTrendingCommunities(resp.data.communities);
      setTrendingGroups(resp.data.groups);
    }).catch(err=>{

    });
  }, []);

  return (
        <SemiFullPageScreen>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title1}>Search</Text>
          </View>
          <TouchableWithoutFeedback onPress={()=>{navigation.navigate('searchfullscreen')}}>
              <View style={styles.sectionView}>
                <View style={styles.searchBoxAround}>
                    <Image source={require("../../assets/icons/search.png")} style={styles.searchIcon}/>
                    <Text style={globalStyle.regularText}>Find traders and communities</Text>
                </View>
              </View>
          </TouchableWithoutFeedback>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Trending traders</Text>
          </View>
          <View style={styles.sectionViewTraders}>
            {
              trendingGroups.map((group, key) => {
                let groupInterests = "";
                for(let i=0;i<group.interests.length;i++){
                  groupInterests+= tradingTypes[group.interests[i]]+" / ";
                  if(i == group.interests.length - 1){
                    groupInterests = groupInterests.substring(0, groupInterests.length - 2);
                  }
                }
                return (
                  <View key={key} style={[styles.postCardTradersContainer, {marginRight:key%2 == 0?"1%":0, marginLeft:key%2 == 0?0:"1%"}]}>
                    <View style={styles.traderProfilePictureContainer}>
                        <Image source="" style={styles.traderProfilePicture}/>
                    </View>
                    <View style={styles.traderTextContainer}>
                        <Text style={globalStyle.regularTextBold}>@{group.name}</Text>
                    </View>
                    <View style={[styles.traderTextContainer, {marginBottom:30}]}>
                        <Text style={[globalStyle.regularText, styles.marginBottomText]}><Text style={globalStyle.regularTextBold}>{group.qtitymembers}</Text> members</Text>
                        <Text style={[globalStyle.regularText, styles.marginBottomText]}>{groupInterests}</Text>
                        <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>${group.membershipprice%10==0?(group.membershipprice/100)+"0":group.membershipprice/100}</Text> membership</Text>
                    </View>
                    <TouchableNativeFeedback onPress={()=>{navigation.navigate("profileOverviewScreen", {id:group.id})}}>
                      <View>
                          <Text style={[globalStyle.regularTextBold, styles.viewProfileButton]}>view profile</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                );
              })
            }
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Trending communities</Text>
          </View>
          <View style={styles.sectionView}>
            {
              trendingCommunities.map((community, key) => {
                let ticker = null;
                if(community.ticker){
                  ticker = "("+community.ticker+")";
                }
                return (
                  <TouchableNativeFeedback key={key} onPress={()=>{navigation.navigate("community_screen", {id:community.id})}}>
                    <View key={key} style={styles.postCardCommunitiesContainer}>
                      <View style={styles.profilePhotoContainer}>
                        <Image source="" style={styles.profilePhoto}/>
                      </View>
                      <View>
                          <Text style={[globalStyle.regularTextBold, styles.textWithMarginBottom]}>{community.name} {ticker}</Text>
                          <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>{community.qtitymembers} members • {community.qtityposts} posts</Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                );
              })
            }
          </View>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
    viewProfileButton:{
        padding:10,
        borderWidth:1,
        borderColor:"black",
        borderRadius:100,
        textAlign:"center"
    },
    marginBottomText:{
        marginBottom:10
    },
    traderProfilePictureContainer:{
        width:"100%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        marginBottom:10
    },
    traderProfilePicture:{
        width:40,
        height:40,
        borderRadius:100,
        borderWidth:1,
        borderColor:"black"
    },
    traderTextContainer:{
        width:"100%",
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"center",
        marginBottom:10
    },
    profilePhoto:{
        width:40,
        height:40,
        borderColor:"black",
        borderWidth:1,
        borderRadius:100
    },
    profilePhotoContainer:{
     marginRight:10
    },
  sectionView:{
    width:"100%",
    paddingBottom:10,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
  },
  sectionViewTraders:{
    width:"100%",
    paddingBottom:10,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
    flexDirection:"row",
    flexWrap:"wrap"
  },
  searchBoxAround:{
    width:"100%",
    borderColor:"black",
    borderWidth:1,
    padding:10,
    borderRadius:50,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  searchIcon:{
    height:30,
    width:30,
    marginRight:10
  },
  postCardCommunitiesContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:15,
    borderRadius:10,
    marginBottom:10,
    flexDirection:"row"
  },
  postCardTradersContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:10,
    borderRadius:10,
    width:"49%",
    marginBottom:10
  },
  textWithMarginBottom:{
    marginBottom:5
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
