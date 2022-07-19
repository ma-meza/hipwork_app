import React, {useEffect} from 'react';
import { BackHandler, StyleSheet, Easing, Animated, RefreshControl, Text, View, SafeAreaView, Image, StatusBar, TouchableWithoutFeedback, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, Dimensions } from 'react-native';



const globalStyle = require('../../assets/style/globalStyle');


const windowWidth = Dimensions.get('window').width;

let intervalVar = null;

export default function AccountScreen({max_approval_timestamp}) {
    const [barWidth, setBarWidth] = React.useState(0);

    useEffect(()=>{
        intervalVar = setInterval(()=>{
            const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
            let threeMinInSeconds = 180;
            let deltaTime = Number(max_approval_timestamp) - currentTimeSeconds;
            if(deltaTime>0){
                console.log(deltaTime);
                let currentWidthRatio = deltaTime / threeMinInSeconds;
                let totalBarWidth = windowWidth - 60;
                setBarWidth(totalBarWidth - (totalBarWidth * currentWidthRatio));
            }else{
                clearTimeout(intervalVar);
            }
        }, 250);
    }, []);


    return (
        <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarMoving, {width:barWidth}]}></Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
  progressBarBackground:{
    height:7.5,
    width:"100%",
    borderRadius:100,
    backgroundColor:"rgba(0,0,0,0.15)",
    overflow:"hidden"
  },
  progressBarMoving:{
    height:"100%",
    left:0,
    position:"absolute",
    top:0,
    backgroundColor:"blue"
  }
});
