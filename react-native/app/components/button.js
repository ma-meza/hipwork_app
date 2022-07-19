import React from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";
import globalStyle from "../../assets/style/globalStyle"

export default function Button({onPress, title, style, buttonStyle}){
    return (
        <TouchableHighlight underlayColor={style.underlayColor} style={[styles.button, {backgroundColor:style.backgroundColor}, buttonStyle]} onPress={onPress}>
                <Text style={[globalStyle.regularTextBold, {color:style.color}]}>{title}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button:{
        backgroundColor:"#00cc99",
        justifyContent:"center",
        borderRadius:50,
        alignItems:"center",
        height:55,
        paddingHorizontal:25,
        paddingVertical:25,
        minWidth:'90%'
    }
});