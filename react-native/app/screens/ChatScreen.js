import React, {useEffect} from "react";
import {Keyboard, StyleSheet,Text, Dimensions, BackHandler,TextInput, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeElapsedCalculator} from "../../utils";


const globalStyle = require('../../assets/style/globalStyle');
const frontZeroFormatter = (number)=>{
    let parsedNumber = Number(number);
    if(parsedNumber<10){
        return "0"+parsedNumber;
    }else{
        return parsedNumber;
    }
}

const windowWidth = Dimensions.get('window').width;

export default function ChatScreen({onPress, groupId, timestamp, scrollToBottom, scrollUp, toggleMainScroll}){
    const [messages, setMessages] = React.useState([]);
    const [chatInput, setChatInput] = React.useState("");
    const [windowHeight, setWindowHeight]= React.useState(Dimensions.get('window').height);
    const [isScrollEnabled, setIsScrollEnabled] = React.useState(true);
    const chatInputRef = React.useRef();
    const [username, setUsername] = React.useState("");
    const scrollRef = React.useRef();

        async function getUsername(){
        const usernameValue = await AsyncStorage.getItem('username');
        setUsername(usernameValue);
      }

    useEffect(() => {
            if(windowHeight == Dimensions.get("window").height){
                scrollToBottom();
            }
     }, [windowHeight]);

    useEffect(()=>{

        getUsername();
        Keyboard.addListener("keyboardDidShow", (e)=>{
            let keyboardHeight = e.endCoordinates.height;
            setWindowHeight(Dimensions.get('window').height - keyboardHeight);
        });
        Keyboard.addListener("keyboardDidHide", (e)=>{
            setWindowHeight(Dimensions.get('window').height);
        });

        axios.get(window.api_prefix+"/getGroupMessages?id="+groupId+"&timestamp="+timestamp).then((resp)=>{
            if(resp.data.success == true){
                console.log(resp.data.chat);
                setMessages(resp.data.chat);
            }else{

            }
        }).catch();
    }, []);

    const sendChat = ()=>{
        const chatValue = chatInput;
        const currentEpoch = Math.floor(new Date().getTime() / 1000);
        setMessages([{message:chatValue, name:username, timestamp:currentEpoch},...messages]);
        setChatInput("");
        scrollRef.current.scrollTo({y:0, animated:true});
        axios.post(window.api_prefix+"/sendChat", {message:chatValue, groupId, challengeStartTimestamp:timestamp});
        Keyboard.dismiss();
    }


    const handleScrollEnd = (event) =>{
        if(event.nativeEvent.contentOffset.y == 0){
            // toggleMainScroll(true);
            // setIsScrollEnabled(false);
        }else{
            // toggleMainScroll(false);
        }
    }

    const handleScroll = (event) => {
        if(event.nativeEvent.contentOffset.y == 0){
            chatInputRef.current.blur();
        }
    }
    return (
        <View style={[styles.mainContainer, {backgroundColor:"pink", height:windowHeight}]}>
            <TouchableWithoutFeedback onPress={scrollUp}>
                <View style={styles.topBar}>
                    <Text style={[globalStyle.regularText, {color:"white", textAlign:"center"}]}>Pictures</Text>
                    <Image style={[styles.arrowImage, {transform:[{rotate:"90deg"}], tintColor:"white", height:30, width:30}]} source={require("../../assets/icons/chevron-right.png")} />
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.chatContainer}>
                <ScrollView scrollEnabled={isScrollEnabled} ref={scrollRef} onScroll={handleScroll} onMomentumScrollEnd={handleScrollEnd} nestedScrollEnabled={true} style={{flex:1, backgroundColor:"transparent", alignSelf:"stretch", paddingBottom:10}}>
                    {
                        messages.map((value, key)=>{
                            let formattedDate = timeElapsedCalculator(value.timestamp);
                            
                            return (
                                <View key={key} style={styles.messageRow}>
                                    <Image style={{height:35, width:35, backgroundColor:"grey", borderRadius:100, marginRight:10}} />
                                    <View>
                                        <Text style={[globalStyle.regularText, {color:"white", marginBottom:5}]}><Text style={globalStyle.regularTextBold}>{value.name}</Text> • {formattedDate}</Text>
                                        <Text style={[{color:"white"}, globalStyle.regularText]}>{value.message}</Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                </ScrollView>
            </View>
            <View style={{borderTopWidth:1,borderTopColor:"rgba(255,255,255,0.4)",backgroundColor:"black", alignSelf:"stretch", flexDirection:"row", alignItems:"center", justifyContent:"center", paddingVertical:15, paddingHorizontal:10}}>
                <TextInput multiline ref={chatInputRef} onBlur={()=>{setWindowHeight(Dimensions.get('window').height);}} placeholder="write message" value={chatInput} style={[{paddingVertical:10, flex:1, paddingHorizontal:10, backgroundColor:"white", borderRadius:25, alignSelf:"stretch", maxHeight:90, marginRight:10}, globalStyle.regularText]} onChangeText={setChatInput} />
                <TouchableWithoutFeedback onPress={sendChat}>
                    <Image source={require("../../assets/icons/paper-airplane.png")} style={{height:30, width:30, tintColor:"white"}}/>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    messageRow:{
        flex:1,
        flexDirection:"row",
        paddingHorizontal:10,
        paddingVertical:10
    },
mainContainer:{
    width:windowWidth,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"flex-start"
},
topBar:{
    width:"100%",
    alignItems:"center",
    backgroundColor:"black",
    paddingHorizontal:15,
    flexDirection:"column",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight+10:0
  },
  chatContainer:{
    justifyContent:"flex-start",
    width:"100%",
    alignSelf:"center",
    flex:1,
    alignItems:"center",
    backgroundColor:"black",
    flexDirection:"column"
  },
});