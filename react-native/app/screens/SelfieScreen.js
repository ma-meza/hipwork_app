import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Dimensions, Text, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import {Camera} from "expo-camera";
import axios from "axios";
const globalStyle = require('../../assets/style/globalStyle');



const gcd = (a,b) =>{
    if (b < 0.0000001) return a;                // Since there is a limited precision we need to limit the value.

    return gcd(b, Math.floor(a % b));           // Discard any fractions due to limitations in precision.
}


export default function FullPageScreen({navigation, route}) {

const [hasPermission, setHasPermission] = useState(null);
const [isRatioSet, setIsRatioSet] = useState(false);
const [ratio, setRatio] = useState('3:4');
const [cameraHeight, setCameraHeight] = useState(0);
const [cameraWidth, setCameraWidth] = useState(0);

const [isPhotoTaken, setIsPhotoTaken] = useState(false);
const [photoData, setPhotoData] = useState({});


const cameraRef = useRef();


const { height, width } = Dimensions.get('window');
const screenRatio = height / width;

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status == "granted");
        })();
    }, []);

    const setCameraReady = async() => {
        if (!isRatioSet) {
          await prepareRatio();
        }
      };

      const handleSendPicture = () =>{
        let localUri = photoData.uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        let photoFormData = {uri:localUri, name:filename, type};
        let formData = new FormData();
        formData.append('photo', photoFormData);
        formData.append("startTimestamp", route.params.startTimestamp);
        formData.append("groupId", route.params.id);
        

        axios.post(window.api_prefix+"/uploadChallengePicture", formData).then(resp=>{
            if(resp.data.success == true){
                navigation.navigate("homeScreen", {refresh:true});
            }
        }).catch();
      }

    const prepareRatio = async () =>{
        let desiredRatio = '3:4';
        if (Platform.OS === 'android') {
            const ratios = await cameraRef.current.getSupportedRatiosAsync();
      
            // Calculate the width/height of each of the supported camera ratios
            // These width/height are measured in landscape mode
            // find the ratio that is closest to the screen ratio without going over
            let distances = {};
            let realRatios = {};
            let minDistance = null;
            for (const ratio of ratios) {
              const parts = ratio.split(':');
              const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
              realRatios[ratio] = realRatio;
              // ratio can't be taller than screen, so we don't want an abs()
              const distance = screenRatio - realRatio; 
              distances[ratio] = realRatio;
              if (minDistance == null) {
                minDistance = ratio;
              } else {
                if (distance >= 0 && distance < distances[minDistance]) {
                  minDistance = ratio;
                }
              }
            }
            // set the best match
            desiredRatio = minDistance;            

            //set sreen ratios
            if(screenRatio>desiredRatio){
                //height will touch sides last
                setCameraHeight("100%");
                let heightPercentage = ((height * (1/screenRatio)) / width * 100)+"%";
                setCameraWidth(heightPercentage);
            }else if(screenRatio<desiredRatio){
                //sides will touch sides last
                setCameraWidth("100%");
                let widthPercentage = ((width * screenRatio) / height * 100)+"%";
                setCameraHeight(widthPercentage);

            }else{
                //equal ratio
                setCameraWidth("100%");
                setCameraHeight("100%");
            }

            // set the preview padding and preview ratio
            setRatio(desiredRatio);
            // Set a flag so we don't do this calculation each time the screen refreshes
            setIsRatioSet(true);
        }
    }

  if (hasPermission == null) {
      
    return <View />;
  }
  if (hasPermission == false) {
    return <Text>No access to camera</Text>;
  }

  if(isPhotoTaken){
    return (
        <View style={{flex:1}}>
            <ImageBackground source={photoData} resizeMode="cover" style={{flex: 1, justifyContent: "center", transform:[{scaleX: -1}]}}>
                <SafeAreaView style={[styles.container, {transform:[{scaleX:-1}]}]}>
                    <View style={styles.topBar}>
                        <TouchableNativeFeedback onPress={()=>{setIsPhotoTaken(false); setPhotoData({})}}>
                            <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
                        </TouchableNativeFeedback>
                        <Text style={globalStyle.title2}>{route.params.groupName}</Text>
                    </View>
                    <View style={{width:"100%", position:"absolute", left:0, bottom:20, paddingHorizontal:20,alignItems:"flex-end", flexDirection:"column",justifyContent:"center", height:60}}>
                        <TouchableWithoutFeedback onPress={handleSendPicture}>
                            <Image style={{backgroundColor:"red", height:60, width:60, borderRadius:100}}/>
                        </TouchableWithoutFeedback>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
  }
  return (
    <View style={{flex:1, alignItems:"flex-start", justifyContent:"flex-start", flexDirection:"column"}}>
        <Camera onCameraReady={setCameraReady} flashMode="on" ratio={ratio} ref={cameraRef} style={[styles.camera, {width:cameraWidth, height:cameraHeight}]} type={Camera.Constants.Type.front}></Camera>
        <SafeAreaView style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableNativeFeedback onPress={()=>{navigation.goBack()}}>
                        <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
                    </TouchableNativeFeedback>
                    <Text style={globalStyle.title2}>{route.params.groupName}</Text>
                </View>
                <View style={styles.topBar}>
                    <Text style={globalStyle.title2}>{"Send a selfie of you with a finger mustach."}</Text>
                </View>
                <View style={{width:"100%", position:"absolute", left:0, bottom:20, alignItems:"center", flexDirection:"column",justifyContent:"center", height:110}}>
                    <TouchableWithoutFeedback onPress={async ()=>{
                        if (cameraRef.current) {
                            let photo = await cameraRef.current.takePictureAsync();
                            setIsPhotoTaken(true);
                            setPhotoData(photo);
                          }
                    }}>
                        <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center', height:"100%", width:110}}>
                            <View style={styles.pictureButtonOutterBorder}>

                            </View>
                            <View style={styles.pictureButton}>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    pictureButton:{
        width:108,
        height:108,
        borderWidth:5,
        borderColor:"white",
        borderRadius:100,
        position:"absolute",
        top:1
    },
    pictureButtonOutterBorder:{
        width:110,
        height:110,
        borderWidth:7,
        borderColor:"black",
        borderRadius:100,
        position:"absolute",
        top:0
    },
    camera:{
        position:"absolute"
    },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    width:"100%",
    backgroundColor:"transparent",
    justifyContent:"flex-start",
    alignItems:"center",
    paddingHorizontal:15,
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
      backgroundColor:"red",
      alignSelf:"stretch",
      flex:1
  }
});
