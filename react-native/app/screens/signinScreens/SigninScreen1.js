import { AuthContext } from '../../components/context';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, Platform, StatusBar,SafeAreaView, Image, TouchableNativeFeedback, Pressable } from 'react-native';
import MainButton from "../../components/button";
import axios from 'axios';
const globalStyle = require('../../../assets/style/globalStyle');



export default function FullPageScreen({navigation}) {
    const {signIn} = React.useContext(AuthContext);
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
                <Image style={styles.arrowImage} source={require("../../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Text style={[globalStyle.title1, {color:"black", textAlign:"center", marginBottom:80, alignSelf:"stretch"}]}>What's your phone number?</Text>
            <Pressable onPress={()=>{realPhoneInputRef.current.blur();realPhoneInputRef.current.focus();}} style={{alignSelf:"stretch"}}>
                <View pointerEvents="none" >
                    <TextInput placeholder="phone number" editable={false} style={[styles.inputText, globalStyle.regularText, {backgroundColor:isPhoneActive?"white":"#e1e1e1", color:"black", borderColor:isPhoneActive?"#0c8881":null, borderWidth:isPhoneActive?2:0}]} value={formattedPhone} onBlur={()=>{setPhoneActive(false)}} />
                </View>
            </Pressable>
            {errorText.length>0? <Text style={[globalStyle.errorText, {marginBottom:15}]}>{errorText}</Text>:null}
            <TextInput ref={realPhoneInputRef} style={{opacity:0}} value={phone} onBlur={()=>{setPhoneActive(false)}} autoCompleteType="tel" autoFocus={true} keyboardType="number-pad" onFocus={()=>{setPhoneActive(true)}} onChangeText={(text)=>{changePhoneValue(text)}}/>
            {/* <TouchableWithoutFeedback onPress={()=>{navigation.navigate('signinScreen')}}>
                <Text style={[globalStyle.regularTextBold, {marginBottom:30, textDecorationLine:"underline"}]}>Already have an account?</Text>
            </TouchableWithoutFeedback> */}
        </View>
        <View>
            {/* <MainButton style={{backgroundColor:"white", color:"black", underlayColor:"#e1e1e1"}} onPress={()=>{handleSignup(username, email, password)}} title={"continue"}/> */}
            <MainButton style={{backgroundColor:"#0c8881", color:"white", underlayColor:"#e1e1e1"}} onPress={()=>{
               if(phone.length==10 && (/^[0-9]{0,10}$/).test(phone) ){
                    setErrorText("");
                    setIsApiLoading(true);
                    axios.post(window.api_prefix+"/sendVerifSms", {phone, verifType:"signin"}).then(resp=>{
                        if(resp.data.success == true){
                            navigation.navigate("signinScreen2", {phoneNumber:phone});
                            setTimeout(()=>{
                                setIsApiLoading(false);
                            }, 1000);
                        }else{
                            setIsApiLoading(false);
                            setErrorText(resp.data.message);
                        }
                    }).catch(err=>{
                        setIsApiLoading(false);
                        setErrorText("There has been a server error, please try again.");
                    });
               }else{
                    setIsApiLoading(false);
                   setErrorText("Please fill in a valid phone number.");
               }
            }} title={"continue"}/>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
          tintColor:"black"
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
