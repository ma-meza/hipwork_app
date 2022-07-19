//user flow:
//1st visit: home (trending groups)/search (closed groups) -> signup/signin -> pick interests -> generate feed



import 'react-native-gesture-handler';

//font hooks
import * as Font from "expo-font";

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SearchFullScreen from "./app/screens/SearchFullScreen";
import SubscriptionGroupScreen from "./app/screens/SubscriptionGroupScreen";
import CommunityGroupScreen from "./app/screens/CommunityGroupScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import SignupScreen from "./app/screens/SignupScreen";
import ProfileOverviewScreen from "./app/screens/ProfileOverview";
import UserProfileScreen from "./app/screens/UserProfileScreen";
import SubscriptionOnboardingScreen from "./app/screens/SubscriptionOnboardingScreen";
import GroupGalleryScreen from "./app/screens/GroupGalleryScreen";
import SelfieScreen from "./app/screens/SelfieScreen";
import SlideshowScreen from "./app/screens/SlideshowScreen";
import MainSwiperScreen from "./app/screens/MainSwiperScreen";
import CreateGroupScreen from "./app/screens/CreateGroupScreen";
import AddFriendsScreen from "./app/screens/AddFriendsScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import GroupSettingsScreen from "./app/screens/GroupSettingsScreen";
import GroupAddMembersScreen from "./app/screens/GroupAddMembersScreen";
import SeeGroupMembersScreen from "./app/screens/SeeGroupMembersScreen";

import ShiftHistoryScreen from "./app/screens/ShiftHistoryScreen";
import ShiftDetailsScreen from "./app/screens/ShiftDetailsScreen";
import WorkProfileScreen from "./app/screens/WorkProfileScreen";
import PaymentsScreen from "./app/screens/PaymentsScreen";
import ChangeSettingScreen from "./app/screens/ChangeSettingScreen";

import ShiftReceiptScreen from "./app/screens/ShiftReceiptScreen";

import LoadingScreen from "./app/screens/LoadingScreen";

import SigninScreen from './app/screens/signinScreens/SigninScreen1';
import SigninScreen2 from './app/screens/signinScreens/SigninScreen2';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react/cjs/react.development';

import { AuthContext } from './app/components/context';

import axios from "axios";
const customFonts = {
  "Graphik Regular": require("./assets/fonts/GraphikRegular.otf"),
  "Graphik Bold": require("./assets/fonts/GraphikBold.otf"),
  "Graphik Medium": require("./assets/fonts/GraphikMedium.otf"),
  "Graphik Semibold": require("./assets/fonts/GraphikSemibold.otf")
};

const Stack = createStackNavigator();


async function _loadFontsAsync(cb) {
  await Font.loadAsync(customFonts);
  cb();
};
if(process.env.NODE_ENV && process.env.NODE_ENV == "development"){
  window.api_prefix = "http://192.168.2.20:8080";
}else{
  window.api_prefix = "https://api.traderz.com";
}



export default function App() {

  const [isFontLoading, setIsFontLoading] = useState(true);
  const [useFakeLoadingScreen, setUseFakeLoadingScreen] = useState(true);

  const initialSigninState = {
    userToken: null,
    userName: null
  }
  const signinReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isAppLoading: false
        };
      case "SIGNIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isAppLoading: false
        };
      case "SIGNOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isAppLoading: false
        };
      case "SIGNUP":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isAppLoading: false
        };
    }
  }

  const [signinState, dispatch] = React.useReducer(signinReducer, initialSigninState);

  const authContext = React.useMemo(() => ({
    signIn: async (phone, password, cb) => {
      let userToken = null;
      axios.post(window.api_prefix+"/login", {phone:phone, password:password}).then(async resp=>{
        if(resp.data.success == false){
          cb(resp.data.message);
        }else if(resp.data.success == true){
          userToken = resp.data.token;
          axios.defaults.headers.common["Authorization"] = userToken;
          try {
            await AsyncStorage.setItem('userToken', userToken);
            await AsyncStorage.setItem('username', resp.data.name);
            dispatch({ type: "SIGNIN", id: phone, token: userToken });
          } catch (e) {
            cb("There has been a server error, please try again.");
          }
        }else{
          cb("There has been a server error, please try again.");
        }
      }).catch(err=>{
        cb("There has been a server error, please try again.");
      });
    },
    signOut: async () => {
      try {
        delete axios.defaults.headers.common["Authorization"]
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "SIGNOUT" });
    },
    signUp: async(username, email, password, cb) => {
      let userToken = null;
      axios.post(window.api_prefix+"/signup", {email:email, password:password, username:username}).then(async resp=>{
        console.log(resp);
        if(resp.data.success == false){
          cb(resp.data.message);
        }else if(resp.data.success == true){
          userToken = resp.data.token;
          try {
            await AsyncStorage.setItem('userToken', userToken);
            await AsyncStorage.setItem('username', resp.data.name);
            dispatch({ type: "SIGNUP", id: email, token: userToken });
          } catch (e) {
            cb("There has been a server error, please try again.");
          }
        }else{
          cb("There has been a server error, please try again.");
        }
      }).catch(err=>{
        console.log(err);
        cb("There has been a server error, please try again.");
      });
    }
  }), []);


  _loadFontsAsync(() => {
    setIsFontLoading(false)
  });

  useEffect(() => {

    //get timezone and save to memory
    let date = new Date();
    let offsetInHours = date.getTimezoneOffset() / -60;
    setTimeout(async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        await AsyncStorage.setItem('timezone', offsetInHours.toString());
        axios.defaults.headers.common["Authorization"] = userToken;
        if (userToken != null) {
          dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
        } else {
          dispatch({ type: "SIGNOUT" });
        }
      } catch (e) {
        console.log(e);
      }
    }, 1);
    setTimeout(()=>{
      setUseFakeLoadingScreen(false);
    }, 1000);
  }, []);

  if (isFontLoading) {
    return null;
  }
  if (signinState.isAppLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar translucent backgroundColor="white" translucent={true} />
      <NavigationContainer>
        {
          signinState.userToken != null ? (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animationEnabled: false
              }}>
              <Stack.Screen name="tabHome" component={MainSwiperScreen} />
              <Stack.Screen name="groupPhotoGalleryScreen" component={GroupGalleryScreen} />
              <Stack.Screen name="selfieScreen" component={SelfieScreen} />
              <Stack.Screen name="createGroupScreen" component={CreateGroupScreen} />
              <Stack.Screen name="seeGroupMembersScreen" component={SeeGroupMembersScreen} />
              <Stack.Screen name="groupSettingsScreen" component={GroupSettingsScreen} />
              <Stack.Screen name="groupAddMembersScreen" component={GroupAddMembersScreen} />
              <Stack.Screen name="settingsScreen" component={SettingsScreen} />
              <Stack.Screen name="addFriendsScreen" component={AddFriendsScreen} />
              <Stack.Screen name="slideshowScreen" component={SlideshowScreen} />
              <Stack.Screen name="settings" component={SettingsScreen} />
              <Stack.Screen name="searchfullscreen" component={SearchFullScreen} />
              <Stack.Screen name="group_screen" component={SubscriptionGroupScreen} />
              <Stack.Screen name="community_screen" component={CommunityGroupScreen} />
              <Stack.Screen name="profileOverviewScreen" component={ProfileOverviewScreen} />
              <Stack.Screen name="userProfileScreen" component={UserProfileScreen} />
              <Stack.Screen name="subscriptionOnboardingScreen" component={SubscriptionOnboardingScreen} />
              <Stack.Screen name="changeSettingScreen" component={ChangeSettingScreen} />
              <Stack.Screen name="paymentsScreen" component={PaymentsScreen} />
              <Stack.Screen name="shiftHistoryScreen" component={ShiftHistoryScreen} />
              <Stack.Screen name="shiftDetailsScreen" component={ShiftDetailsScreen} />
              <Stack.Screen name="shiftReceiptScreen" component={ShiftReceiptScreen} />
              <Stack.Screen name="workProfileScreen" component={WorkProfileScreen} />
            </Stack.Navigator>
          )
            :
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}>
              {useFakeLoadingScreen?<Stack.Screen name="fakeLoadingScreen" component={LoadingScreen} />:null}
              <Stack.Screen name="welcomeScreen" component={WelcomeScreen} />

              <Stack.Screen name="signinScreen" component={SigninScreen} />
              <Stack.Screen name="signinScreen2" component={SigninScreen2} />

              <Stack.Screen name="signupScreen" component={SignupScreen} />
            </Stack.Navigator>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}