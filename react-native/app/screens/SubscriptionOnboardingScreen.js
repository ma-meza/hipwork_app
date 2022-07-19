import { AuthContext } from '../components/context';
import React, {useState} from 'react';
import { StyleSheet, ActivityIndicator, Text, View,TextInput, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity,TouchableWithoutFeedback, TouchableHighlight, Alert, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import CustomButton from "../components/button";
const globalStyle = require('../../assets/style/globalStyle');



export default function FullPageScreen({navigation}) {
    const [subsPrice, setSubsPrice] = useState("");
    const [subsPriceActive, setSubsPriceActive] = useState(false);
    const [errorText, setErrorText] = useState("");
    let actualPriceInput = React.createRef();
    let formattedSubsPrice = "$"+subsPrice.toString();
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
            <TouchableNativeFeedback onPress={()=>{navigation.goBack()}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Text style={globalStyle.title1}>Monetize your trading community</Text>
        </View>
        <View style={styles.contentContainer}>
            <Text style={[globalStyle.regularTextBold, {marginBottom:15, marginTop:40}]}>When your create your own trading community, people can subscribe to your group for a fee to view signals and posts you send. A trader score based on the quality of signals you publish will be made public. The greater your score, the more followers you'll have. </Text>
            <Text style={[globalStyle.regularTextBold, {marginBottom:30}]}>When you publish a signal, you'll have 15 seconds to edit or remove it. Be careful because your trader score will be impacted by the success of your signal.</Text>

            {errorText.length>0? <Text style={[globalStyle.errorText, {marginBottom:15}]}>{errorText}</Text>:null}
            <Text style={[globalStyle.regularText, {marginBottom:10}]}>Subscription price</Text>
            <TouchableWithoutFeedback onPress={()=>{
                actualPriceInput.current.focus();
            }}>
                <View style={[styles.inputText, {backgroundColor:subsPriceActive?"#fff":"#e1e1e1", borderWidth:subsPriceActive?1:null, borderColor:subsPriceActive?"#000":null}]}>
                    <Text style={[globalStyle.regularText]}>{formattedSubsPrice}</Text>
                </View>
            </TouchableWithoutFeedback>
            <TextInput ref={actualPriceInput} blurOnSubmit={true} style={{backgroundColor:"transparent", height:0}} value={subsPrice.toString()} onBlur={()=>{setSubsPriceActive(false)}} onFocus={()=>{setSubsPriceActive(true)}} onChangeText={(value)=>{
                let splittedDot = value.split(".");
                if((value.length<=8 && value.length>=0) && (!value.includes(",")) && (splittedDot.length - 1 <= 1) && value.match(/^[0-9]*\.?[0-9]*$/)){
                    if(value.includes(".")){
                        let splittedDot = value.split(".");
                        if(splittedDot[1].length<= 2){
                            setSubsPrice(value);
                        }
                    }else{
                        setSubsPrice(value);
                    }
                }
            }}/>
            <CustomButton title="Continue" onPress={()=>{alert("YO")}}/>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    scrollView:{
        width:"100%",
        height:"100%"
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    width:"100%",
    backgroundColor:"#fff",
    top:0,
    height:80,
    justifyContent:"flex-start",
    alignItems:"center",
    paddingLeft:15,
    flexDirection:"row"
  },
  arrowImage:{
      height:40,
      width:40,
      marginRight:10
  },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      backgroundColor:"#fff",
      alignSelf:"stretch",
      flex:1,
      paddingLeft:15,
      paddingRight:15
  },
  inputText:{
    borderRadius:10,
    height:55,
    marginBottom:15,
    paddingLeft:10,
    paddingRight:10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  activeInput:{
      borderColor:"#000",
      borderWidth:1
  },
  button:{
      backgroundColor:"#00cc99",
      justifyContent:"center",
      borderRadius:10,
      alignItems:"center",
      height:55
  }
});
