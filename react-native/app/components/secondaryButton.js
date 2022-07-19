import React from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";
import globalStyle from "../../assets/style/globalStyle"

export default function Button({onPress, title, style}){
    return (
        <TouchableHighlight underlayColor="#00a37a" style={[styles.button, {borderColor:style.borderColor}]} onPress={onPress}>
                <Text style={[globalStyle.regularTextBold, {color:style.color}]}>{title}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button:{
        backgroundColor:"transparent",
        justifyContent:"center",
        borderRadius:50,
        alignItems:"center",
        height:55,
        borderWidth:2,
        borderStyle:"solid"
    }
});