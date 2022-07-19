import React from 'react';
import { StyleSheet, Platform, StatusBar,SafeAreaView,} from 'react-native';
const globalStyle = require('../../assets/style/globalStyle');



export default function SemiFullPageScreen({children}) {
  return (
    <SafeAreaView style={styles.container}>
            {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    backgroundColor:"white"
  }
});
