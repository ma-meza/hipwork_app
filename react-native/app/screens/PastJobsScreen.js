import { StatusBar } from 'expo-status-bar';
import React from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, Text, View, TextInput,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback,ScrollView,RefreshControl, Button, TouchableWithoutFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import { useState } from 'react/cjs/react.development';


export default function SkillsScreen({navigation, route}) {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshing(false);
    }, []);
    return (
          <View style={styles.mainView}>
            <ScrollView style={styles.sectionViewNoPadding}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
                
            </ScrollView>
          </View>
    );
  }
  
  
  const styles = StyleSheet.create({
    mainView:{
      backgroundColor:"white",
      flex:1
    },
    sectionViewNoPadding:{
        backgroundColor:"white",
        width:"100%",
        paddingBottom:20
      },
  });