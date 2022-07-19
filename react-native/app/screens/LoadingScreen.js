import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
  );
};
export default Loading;