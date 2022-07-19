import { AuthContext } from '../../components/context';
import React, {useState} from 'react';
import { StyleSheet, ActivityIndicator, Text, View,TextInput, Platform, StatusBar,SafeAreaView, Image, TouchableNativeFeedback } from 'react-native';
import MainButton from "../../components/button";
const globalStyle = require('../../../assets/style/globalStyle');



export default function FullPageScreen({route,navigation}) {
    const {signIn} = React.useContext(AuthContext);
    const [code, setCode] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    
    const [isApiLoading, setIsApiLoading] = useState(false);

    const [errorText, setErrorText] = useState("");

    const [isCodeActive, setCodeActive] = useState(false);

    React.useEffect(()=>{
        const text = route.params.phoneNumber;
        setFormattedPhone("("+text.substring(0, 3)+") "+text.substring(3, 6)+"-"+text.substring(6, text.length));
      }, []);

    const setCodeValue = (code) => {
        if((/^[0-9]{0,6}$/).test(code)){
            setCode(code);
        }
    }

    const handleLogin = () => {
        let password = code;
        let phoneNumber = route.params.phoneNumber;
        setErrorText("");
        setIsApiLoading(true);
        if(phoneNumber.length>=10 && password.length==6){
            signIn(phoneNumber, password, (apiError)=>{
                setIsApiLoading(false);
                setErrorText(apiError);
            });
        }else{
            setIsApiLoading(false);
            setErrorText("Please fill in a valid code.");
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
                <Image style={styles.arrowImage} source={require("../../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Text style={[globalStyle.title1, {color:"black", textAlign:"center", marginBottom:20, alignSelf:"stretch"}]}>We sent you code to log in to your account</Text>
            <Text style={[globalStyle.regularText, {color:"black", textAlign:"center", marginBottom:80, alignSelf:"stretch"}]}>Sent to {formattedPhone}</Text>
            <TextInput placeholder="code" value={code} onBlur={()=>{setCodeActive(false)}} style={[styles.inputText, globalStyle.regularText, {backgroundColor:isCodeActive?"white":"#e1e1e1", color:"black", borderColor:isCodeActive?"#0c8881":null, borderWidth:isCodeActive?2:0}]} autoCompleteType="tel" autoFocus={true} keyboardType="number-pad" onFocus={()=>{setCodeActive(true)}} onChangeText={(text)=>{setCodeValue(text)}}/>
            {errorText.length>0? <Text style={[globalStyle.errorText, {marginBottom:15}]}>{errorText}</Text>:null}
            {/* <TouchableWithoutFeedback onPress={()=>{navigation.navigate('signinScreen')}}>
                <Text style={[globalStyle.regularTextBold, {marginBottom:30, textDecorationLine:"underline"}]}>Already have an account?</Text>
            </TouchableWithoutFeedback> */}
        </View>
        <View>
            {/* <MainButton style={{backgroundColor:"white", color:"black", underlayColor:"#e1e1e1"}} onPress={()=>{handleSignup(username, email, password)}} title={"continue"}/> */}
            <MainButton style={{backgroundColor:"#0c8881", color:"white", underlayColor:"#e1e1e1"}} onPress={()=>{
               if((/^[0-9]{0,6}$/).test(code) && code.length == 6){
                handleLogin();
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
