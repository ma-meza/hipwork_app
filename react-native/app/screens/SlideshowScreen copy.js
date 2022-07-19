import React, {useEffect, useRef} from 'react';
import axios from "axios";
import { PanResponder, Dimensions, Animated, StyleSheet, Text, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native';
const globalStyle = require('../../assets/style/globalStyle');
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from "react-native-swiper";

const screenHeight = Dimensions.get('window').height;

export default function FullPageScreen({navigation, route}) {
  const [pictures, setPictures] = React.useState([]);
  const [activePictureIndex, setActivePictureIndex] = React.useState(0);

    const [viewToSwipe, setViewToSwipe] = React.useState(-1); //-1 = nothing, 0 = caroussel, 1 = chatbox

  const [chatBoxYTransform, setChatBoxYTransform] = React.useState(screenHeight);

  const pan = useRef(new Animated.ValueXY()).current;

  const panInsideChatBox = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (evt, gesture)=>{
          console.log(evt);
        if(viewToSwipe == -1){
            if(Math.abs(gesture.dy) > Math.abs(gesture.dx)){
                //swipe y, viewtoswipe=1
                setViewToSwipe(1);
                setChatBoxYTransform(screenHeight+gesture.dy);
                pan.x.setValue(gesture.dx);
                pan.y.setValue(gesture.dy);
            }else{
                //swipe x
                setViewToSwipe(0);
            }
        }else if(viewToSwipe == 0){
            
        }else{
            //view to swipe == 1, move chatbox
            setChatBoxYTransform(screenHeight+gesture.dy);
            pan.x.setValue(gesture.dx);
            pan.y.setValue(gesture.dy);
        }
        
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(viewToSwipe == 1){
            if(gestureState.vy < -0.1){
                setChatBoxYTransform(0);
            }else{
                setChatBoxYTransform(screenHeight);
                setViewToSwipe(-1);
            }
        }
        pan.flattenOffset();
      },
    })
  ).current;


  const panResponderInsideChatBox = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panInsideChatBox.setOffset({
          x: panInsideChatBox.x._value,
          y: panInsideChatBox.y._value,
        });
      },
      onPanResponderMove: (_, gesture)=>{
          if(viewToSwipe == 1){
            if(gesture.dy>0){
                setChatBoxYTransform(gesture.dy);
              }
            panInsideChatBox.x.setValue(gesture.dx);
            panInsideChatBox.y.setValue(gesture.dy);
          }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(viewToSwipe == 1){
            if(gestureState.vy > 0.1){
                setChatBoxYTransform(screenHeight);
                setViewToSwipe(-1);
            }else{
                setChatBoxYTransform(0);
            }
        }
        panInsideChatBox.flattenOffset();
      },
    })
  ).current;

  useEffect(()=>{
      setPictures(route.params.pictures.pictures);
  }, []);
  if(pictures.length==0){
      return <View></View>
  }
  return (
    <View style={{flex:1}}>
        <Animated.View {...panResponderInsideChatBox.panHandlers} style={[styles.chatViewContainer, {transform: [{ translateY: chatBoxYTransform }]}]}>

        </Animated.View>
        <SafeAreaView style={styles.container}>
            <LinearGradient style={styles.topBar} colors={['rgba(0,0,0,0.9)', 'transparent']}>
                <View style={styles.topBarInner}>
                    <TouchableNativeFeedback onPress={()=>{navigation.goBack()}}>
                        <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
                    </TouchableNativeFeedback>
                    <Text style={[globalStyle.regularText, {color:"white"}]}><Text style={[globalStyle.regularTextBold]}>{route.params.groupName}</Text> • {route.params.dateString}</Text>
                </View>
                <View style={styles.topBarInner}>
                    <Image style={styles.userImage}/>
                    <Text style={[globalStyle.regularTextBold, {color:"white"}]}>{pictures[activePictureIndex].name}</Text>
                </View>
            </LinearGradient>
            <View {...panResponder.panHandlers} style={{flex:1, backgroundColor:"red", alignSelf:"stretch"}}>
            {
                    pictures.map((value, key)=>{
                        console.log(value);
                        return (
                            <View key={key} style={[styles.backgroundComponent]}>
                                <ImageBackground source={{uri:value.url}} resizeMode="cover" style={{flex:1}}></ImageBackground>
                            </View>
                        );
                    })
                }
            </View>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    chatViewContainer:{
        width:"100%",
        height:"100%",
        position:"absolute",
        left:0,
        top:0,
        backgroundColor:"black",
        zIndex:3
    },
    backgroundComponent:{
        flex:1
    },
  picturesContainer:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"flex-start",
  },
  pictureTile:{
    width:"25%",
    aspectRatio:1,
    borderWidth:1,
    borderColor:"red"
  },
  dateTextContainer:{
    flex:1, 
    paddingHorizontal:20,
    paddingVertical:10
  },
    userImage:{
        height:35,
        width:35,
        borderRadius:100,
        backgroundColor:"grey",
        marginRight:10
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    justifyContent:"center",
    width:"100%",
    alignItems:"flex-start",
    alignSelf:"stretch",
    paddingHorizontal:15,
    paddingVertical:15,
    flexDirection:"column",
    position:"absolute",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    zIndex:2
  },
  topBarInner:{
    justifyContent:"flex-start",
    alignItems:"center",
    alignSelf:"stretch",
    flexDirection:"row",
    marginBottom:10
  },
  arrowImage:{
      height:40,
      width:40,
      marginRight:10,
      tintColor:"white"
  },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      alignSelf:"stretch",
      flex:1
  }
});
