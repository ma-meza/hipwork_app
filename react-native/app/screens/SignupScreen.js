import { AuthContext } from '../components/context';
import React, {useState} from 'react';
import { StyleSheet, ActivityIndicator, Text, View,TextInput, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity,TouchableWithoutFeedback, TouchableHighlight, Alert, TouchableNativeFeedback, ScrollView, Pressable } from 'react-native';
import MainButton from "../components/button";
const globalStyle = require('../../assets/style/globalStyle');



export default function FullPageScreen({navigation}) {
    const {signUp} = React.useContext(AuthContext);
    const [phone, setPhone] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");

    const realPhoneInputRef = React.useRef();

    const [isApiLoading, setIsApiLoading] = useState(false);

    const [errorText, setErrorText] = useState("");

    const [isPhoneActive, setPhoneActive] = useState(false);

    const changePhoneValue = (text) => {
        if((/^[0-9]{0,10}$/).test(text)){
            setPhone(text);
            if(text.length==0){
                setFormattedPhone(text);
            }else if(text.length<3 && text.length>0){
                setFormattedPhone("("+text);
            }else if(text.length<6){
                setFormattedPhone("("+text.substring(0, 3)+") "+text.substring(3, text.length));
            }else if(text.length<11){
                setFormattedPhone("("+text.substring(0, 3)+") "+text.substring(3, 6)+"-"+text.substring(6, text.length));
            }
        }
    }

    const handleSignup = (username, email, pass) => {
        setIsApiLoading(true);
        setErrorText("");
        if(email.length>0 && password.length>0 && username.length >0){
            signUp(username, email, pass, (apiError)=>{
                setErrorText(apiError);
                setIsApiLoading(false);
            });
        }else{
            setErrorText("Please fill in your email, password, and username.");
            setIsApiLoading(false);
        }
    };
    if(isApiLoading == true){
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
        <TouchableNativeFeedback onPress={()=>{navigation.goBack()}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Text style={[globalStyle.title1, {color:"#fff", textAlign:"center", marginBottom:80, alignSelf:"stretch"}]}>Awesome, what’s your phone number?</Text>
            <Pressable onPress={()=>{realPhoneInputRef.current.focus()}} style={{alignSelf:"stretch"}}>
                <View pointerEvents="none" >
                    <TextInput placeholder="phone number" editable={false} style={[styles.inputText, globalStyle.regularText, {backgroundColor:isPhoneActive?"#fff":"#e1e1e1", color:"black"}]} value={formattedPhone} onBlur={()=>{setPhoneActive(false)}} />
                </View>
            </Pressable>
            {errorText.length>0? <Text style={[globalStyle.errorText, {marginBottom:15}]}>{errorText}</Text>:null}
            <TextInput ref={realPhoneInputRef} style={{opacity:0}} value={phone} onBlur={()=>{setPhoneActive(false)}} autoCompleteType="tel" autoFocus={true} keyboardType="number-pad" onFocus={()=>{setPhoneActive(true)}} onChangeText={(text)=>{changePhoneValue(text)}}/>
            {/* <TouchableWithoutFeedback onPress={()=>{navigation.navigate('signinScreen')}}>
                <Text style={[globalStyle.regularTextBold, {marginBottom:30, textDecorationLine:"underline"}]}>Already have an account?</Text>
            </TouchableWithoutFeedback> */}
        </View>
        <View>
            <MainButton style={{backgroundColor:"white", color:"black", underlayColor:"#e1e1e1"}} onPress={()=>{handleSignup(username, email, password)}} title={"continue"}/>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c8881',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    padding:20,
    flexDirection:"column"
  },
  arrowImage:{
      height:40,
      width:40,
      marginBottom:30,
      tintColor:"white"
  },
  contentContainer:{
      backgroundColor:"transparent",
      flex:1,
      flexDirection:"column",
       alignItems:"flex-start",
    justifyContent:"flex-start",
      alignSelf:"stretch"
  },
  inputText:{
    borderRadius:5,
    width:"100%",
    height:65,
    marginBottom:15,
    paddingLeft:15,
    paddingRight:15
  },
  activeInput:{
      borderColor:"#000",
      borderWidth:1
  }
});
