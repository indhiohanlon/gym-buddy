import React from "react";
import { View } from "react-native";

//some style for most components cenetering them on screen
const CenterContainer = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      {children}
    </View>
  );
};

export default CenterContainer;
