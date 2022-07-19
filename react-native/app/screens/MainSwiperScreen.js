import React from 'react';
import {View, ScrollView, Dimensions, BackHandler} from "react-native";
import Swiper from "react-native-swiper";
import Tabs from "../navigation/Tabs";
import NotificationsScreen from "../screens/NotificationsScreen";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ({navigation})=>{
    const [isScrollingActive, setIsScrollingActive] = React.useState(true);
    const swiperRef = React.useRef();

    const removeBackEventListener = () =>{
        BackHandler.removeEventListener("hardwareBackPress", goBackToHome);
    }

    const goBackToHome = () =>{
        swiperRef.current.scrollTo({x:0, animated:true});
        removeBackEventListener();
        return true;
    }
   

    const handleScrollEnd = (e) =>{
        let xPosition = e.nativeEvent.contentOffset.x;
        if(xPosition == 0){
            BackHandler.removeEventListener("hardwareBackPress", goBackToHome);
        }else{
            BackHandler.addEventListener("hardwareBackPress", goBackToHome);
        }
    }
    return (
        <View style={{flex:1}}>
            <ScrollView onMomentumScrollEnd={handleScrollEnd} scrollEnabled={isScrollingActive} snapToInterval={windowWidth} decelerationRate={0.95} ref={swiperRef} horizontal showsHorizontalScrollIndicator={false}>
                <View style={{height:windowHeight, width:windowWidth}}>
                    <Tabs toggleNotificationsScrolling={(value)=>{setIsScrollingActive(value)}} goToNotifications={()=>{swiperRef.current.scrollTo({x:windowWidth, animated:true}); BackHandler.addEventListener("hardwareBackPress", goBackToHome);}} />
                </View>
                <View style={{height:windowHeight, width:windowWidth}}>
                    <NotificationsScreen navigation={navigation} goToHome={goBackToHome}/>
                </View>
            </ScrollView>
        </View>
    );
}