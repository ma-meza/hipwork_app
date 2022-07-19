import globalStyle from "../../assets/style/globalStyle"
import React from 'react';
import MainButton from "../components/button";
import SecondaryButton from "../components/secondaryButton";
import { StyleSheet, Text, View, Platform, StatusBar, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button } from 'react-native';



export default function WelcomeScreen({navigation, route}) {
  return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={[globalStyle.title1, styles.sloganText]}>Where friend groups get closer everyday</Text>
        </View>
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <Text style={[globalStyle.title1, styles.sloganText]}>Where friend groups get closer everyday</Text>
        </View>
        <View>
          <MainButton style={{backgroundColor:"white", color:"black", underlayColor:"#e1e1e1"}} buttonStyle={{marginBottom:20}} title="create account" onPress={()=>{navigation.navigate('signupScreen')}}/>
          <MainButton style={{backgroundColor:"rgba(245,245,255,0.52)", color:"white", underlayColor:"rgba(245,245,255,0.8)"}} title="sign in" onPress={()=>{navigation.navigate('signinScreen')}}/>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c8881',
    alignItems: 'center',
    justifyContent: 'center',
    padding:20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight+20:20
  },
  sloganText:{
    color:"white",
    textAlign:"left"
  }
});
