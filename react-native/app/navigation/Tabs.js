import React from 'react';
import {View, Image, Text, StyleSheet, Dimensions, ScrollView} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import globalStyle from "../../assets/style/globalStyle";

const Tab = createBottomTabNavigator();
const windowWidth = Dimensions.get('window').width;


import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import ConversationsScreen from "../screens/ConversationsScreen";


export default function Tabs({goToNotifications, toggleNotificationsScrolling}){
    const swiperRef = React.useRef();
    return (
            <Tab.Navigator 
                tabBarOptions={{
                    showLabel:false,
                    style:{
                        position:"absolute",
                        bottom:0,
                        width:"100%",
                        height:55,
                        backgroundColor:"white",
                        borderTopLeftRadius:5,
                        borderTopRightRadius:5,
                        borderTopColor:"transparent",
                        alignItems:"center",
                        justifyContent:"center",
                        borderTopColor:"#e9e9e9",
                        borderTopWidth:1
                    }
                }}
                >
                <Tab.Screen name="homeScreen" children={({navigation, route})=>{return <HomeScreen navigation={navigation} route={route} goToNotifications={()=>{goToNotifications()}}/>}} options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:"center", justifyContent:"center"}}>
                            <Image source={require("../../assets/icons/home.png")} style={{tintColor:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)", height:30, width:30}} resizeMode="contain"  />
                            {/* <Text style={[{color:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, focused?globalStyle.regularText:globalStyle.regularText]}>Home</Text> */}
                        </View>
                    )
                }}/>
                <Tab.Screen name="conversationsScreen" children={({navigation, route})=>{return <ConversationsScreen navigation={navigation} toggleNotificationsScrolling={(value)=>{toggleNotificationsScrolling(value)}} route={route} goToNotifications={()=>{goToNotifications()}}/>}} options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:"center", justifyContent:"center"}}>
                            <Image source={require("../../assets/icons/message-circle.png")} style={{tintColor:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)", height:30, width:30}} resizeMode="contain"  />
                            {/* <Text style={[{color:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, focused?globalStyle.regularText:globalStyle.regularText]}>Home</Text> */}
                        </View>
                    )
                }}/>
                {/* <Tab.Screen name="Search" component={SearchScreen} options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:"center", justifyContent:"center"}}>
                            <Image source={require("../../assets/icons/search.png")} style={[{tintColor:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, styles.icons]} resizeMode="contain"  />
                            <Text style={[{color:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, focused?globalStyle.regularTextBold:globalStyle.regularText]}>Search</Text>
                        </View>
                    )
                }}/>
                <Tab.Screen name="Groups" component={GroupsScreen} options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:"center", justifyContent:"center"}}>
                            <Image source={require("../../assets/icons/people.png")} style={[{tintColor:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, styles.icons]} resizeMode="contain"  />
                            <Text style={[{color:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, focused?globalStyle.regularTextBold:globalStyle.regularText]}>Groups</Text>
                        </View>
                    )
                }}/> */}
                <Tab.Screen name="accountScreen" children={({navigation, route})=>{return <AccountScreen navigation={navigation} route={route} toggleNotificationsScrolling={(value)=>{toggleNotificationsScrolling(value)}} />}} options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:"center", justifyContent:"center"}}>
                            <Image source={require("../../assets/icons/user.png")} style={{tintColor:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)", height:30, width:30}} resizeMode="contain"  />
                            {/* <Text style={[{color:focused?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.35)"}, focused?globalStyle.regularText:globalStyle.regularText]}>Account</Text> */}
                        </View>
                    )
                }}/>
            </Tab.Navigator>
    );
}