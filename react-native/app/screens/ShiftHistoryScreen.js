import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, RefreshControl, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();


const cutAfterMaxLength = (sentence, length)=>{
  return sentence.substring(0, length)+"...";
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


const historyArray = [
  {
    id:2,
    hourly_wage:1350,
    start_datetime:'2021-07-30 09:00:00',
    end_datetime:'2021-07-30 17:00:00',
    company:"Escapade festival",
    job_type_name:"Event worker"
  }
];

const moneyFormatter = (money) =>{
  let left = Math.floor(Number(money) / 100);
  let right = Number(money) % 100;
  return "$"+left+"."+right;
}
const scheduleFormater = (start, end) => {
  let startSplit = start.split(" ");
  let endSplit = end.split(" ");

  let startDate = startSplit[0].split("-");
  let endDate = endSplit[0].split("-");

  let startTime = startSplit[1].split(":");
  let endTime = endSplit[1].split(":");

  let startDateString = monthNames[Number(startDate[1])]+" "+startDate[2]+", "+startDate[0]+" - ";
  let startTimeString = startTime[0]+":"+startTime[1];
  let endTimeString = endTime[0]+":"+endTime[1];
  return startDateString+startTimeString+" to "+endTimeString;
}

export default function HomeScreen({navigation, route, goToHome}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    setHistory([...historyArray]);
  }, []);



  return (
        <SemiFullPageScreen>
          <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
          <View style={{flex:1}} style={{backgroundColor:"#f4f4f4", paddingHorizontal:15, borderBottomColor:"#e9e9e9", borderBottomWidth:1, paddingBottom:15, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
              <Image style={{height:30, width:30, tintColor:"black"}} source={require("../../assets/icons/left-arrow.png")}/>
            </TouchableWithoutFeedback>            
            <Text style={[globalStyle.title1, {color:"rgba(0,0,0,0.9)", alignSelf:"stretch", flex:1, textAlign:"center"}]}>Shifts history</Text>
            <Image style={{height:30, width:30, tintColor:"transparent"}}/>
          </View>
          <ScrollView style={styles.sectionView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
              {history.length>0?history.map((value, key)=>{
                return (
                  <TouchableWithoutFeedback key={key} onPress={()=>{navigation.navigate("shiftReceiptScreen", {id:1})}}>
                    <View style={styles.shiftCard}>
                      <View style={styles.cardTop}>
                        <View style={styles.cardTopLeft}>  
                          <Text style={[globalStyle.title2]}>{value.job_type_name}</Text>
                          <Text style={[globalStyle.regularText]}>{value.company}</Text>
                        </View>
                        <Image style={{height:30, width:30}} source={require("../../assets/icons/right-arrow.png")}/>
                      </View>
                      <View style={styles.cardBottom}>
                        <Text style={[globalStyle.title2]}>{moneyFormatter(value.hourly_wage)}/hr</Text>
                        <Text style={[globalStyle.regularText]}>{scheduleFormater(value.start_datetime, value.end_datetime)}</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })
              :
              <Text>No past shifts yet:(</Text>
            }
          </ScrollView>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  sectionContainer:{
    borderBottomWidth:1,
    borderBottomColor:"#e9e9e9",
    paddingVertical:15,
    paddingHorizontal:20,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  greyText:{
    color:"#a1a1a1"
  },
  profilePicture:{
    width:40,
    height:40,
    borderColor:"black",
    borderWidth:1,
    borderRadius:100,
    marginRight:10
  },
  traderInfoContainer:{
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    marginBottom:10
  },
  sectionView:{
    backgroundColor:"#fdfdfd",
    width:"100%",
    padding:20
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTab:{
    flex:1,
    paddingVertical:20,
    paddingHorizontal:0,
    borderBottomColor:"#e1e1e1",
    borderBottomWidth:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
    },
  groupTabMainContainer:{
    flex:1,
    paddingHorizontal:20
  },
  groupPicture:{
    height:45,
    width:45,
    borderRadius:100,
    backgroundColor:"grey",
    marginRight:10
  },
  shiftCard:{
    backgroundColor:"white",
    borderRadius:10,
    elevation:2,
    marginBottom:10,
    overflow:"hidden",
    borderWidth:0.5,
    borderColor:"rgba(0,0,0,0.1)"
  },
  cardBottom:{
    padding:10
  },
  cardTop:{
    padding:10,
    backgroundColor:"#d3eee1",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  cardTopLeft:{
    flex:1
  }
});
