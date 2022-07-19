import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";

import PastJobsScreen from "./PastJobsScreen";
import InterestsScreen from "./InterestsScreen";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const cutAfterMaxLength = (sentence, length)=>{
  return sentence.substring(0, length)+"...";
};


export default function HomeScreen({navigation, route, goToHome}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);



  useEffect(()=>{
      
  }, []);


  return (
        <SemiFullPageScreen>
          <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Work profile</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
            
          </View>
          <Tab.Navigator upperCaseLabel={false} tabBarOptions={{
                labelStyle: [globalStyle.regularTextBold, { textTransform: 'none' }],
                tabStyle: { width: 100 },
                indicatorStyle:{backgroundColor:"black"},
                style: { backgroundColor: '#f4f4f4', borderBottomWidth:1, borderBottomColor:"#e9e9e9", elevation:0 },
                activeTintColor:"black"
            }}>
                <Tab.Screen name="pastJobsScreen" options={{ tabBarLabel: 'PastJobs' }} component={PastJobsScreen} />
                <Tab.Screen name="interestsScreen" options={{ tabBarLabel: 'Interests' }} component={InterestsScreen} />
            </Tab.Navigator>
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
  }
});
