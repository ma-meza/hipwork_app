import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, Text, View, TextInput,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, TouchableWithoutFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export default function HomeScreen({navigation, route}) {

    const [search, setSearch] = useState("");
    const [username, setUsername]= useState("");

    const [subscriptions, setSubscriptions] = useState([]);
    const [communities, setCommuities] = useState([]);
    const [yourGroup, setYourGroup] = useState([]);

    async function getUsername(){
      const usernameValue = await AsyncStorage.getItem('username');
      setUsername(usernameValue);
    }
  
    useEffect(()=>{
      getUsername();
      axios.get(window.api_prefix+"/followedGroups").then(resp=>{
        setCommuities(resp.data.communities);
        setSubscriptions(resp.data.subscriptions);
        setYourGroup(resp.data.yourGroup);
      }).catch(err=>{

      });
    }, []);
  return (
        <SemiFullPageScreen>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title1}>Groups</Text>
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Your group</Text>
          </View>
          <View style={styles.sectionView}>
            {
              yourGroup.issubscriptionsetup == true ?
                (
                  <TouchableNativeFeedback onPress={()=>{navigation.navigate('community_screen')}}>
                    <View style={styles.postCardContainer}>
                      <View style={styles.profilePhotoContainer}>
                          <Image source="" style={styles.profilePhoto}/>
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={[globalStyle.regularTextBold, styles.TextWithBottomMargin]}>@{username}</Text>
                        <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>{yourGroup.qtitymembers} members</Text>
                      </View>
                      <View style={styles.chevronImageContainer}>
                        <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )
                :
                (
                  <TouchableNativeFeedback onPress={()=>{navigation.navigate('subscriptionOnboardingScreen')}}>
                    <View style={styles.postCardContainer}>
                      <View style={styles.textContainer}>
                        <Text style={[globalStyle.regularText]}>Set up your trader subscription service now to get paid for your posts and signals.</Text>
                      </View>
                      <View style={styles.chevronImageContainer}>
                        <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )
            }
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Subscriptions</Text>
          </View>
          <View style={styles.sectionView}>
            {
              subscriptions.map((subscription, key) => {
                return (
                  <TouchableNativeFeedback key={key} onPress={()=>{navigation.navigate('group_screen'), {id:subscription.id}}}>
                    <View key={key} style={styles.postCardContainer}>
                    <View style={styles.profilePhotoContainer}>
                      <Image source="" style={styles.profilePhoto}/>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[globalStyle.regularTextBold, styles.TextWithBottomMargin]}>{subscription.name}</Text>
                      <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>{subscription.qtitymembers} members • {subscription.qtityposts} posts</Text>
                    </View>
                    <View style={styles.chevronImageContainer}>
                      <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                );
              })
            }
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Communities</Text>
          </View>
          <View style={styles.sectionView}>
            {
              communities.map((community, key) => {
                return (
                  <TouchableNativeFeedback key={key} onPress={()=>{navigation.navigate('community_screen'), {id:community.id}}}>
                    <View key={key} style={styles.postCardContainer}>
                    <View style={styles.profilePhotoContainer}>
                      <Image source="" style={styles.profilePhoto}/>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[globalStyle.regularTextBold, styles.TextWithBottomMargin]}>{community.name}</Text>
                      <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]} >{community.qtitymembers} members • {community.qtityposts} posts</Text>
                    </View>
                    <View style={styles.chevronImageContainer}>
                      <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
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
  textContainer:{
    alignSelf:"stretch",
    flex:1,
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center"
  },
  chevronImage:{
    width:20,
    height:40,
    alignSelf:"flex-end"
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
  searchBoxAround:{
    width:"100%",
    borderColor:"black",
    borderWidth:1,
    padding:10,
    borderRadius:50
  },
  TextWithBottomMargin:{
    marginBottom:5
  },
  postCardContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:15,
    borderRadius:10,
    marginBottom:10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
