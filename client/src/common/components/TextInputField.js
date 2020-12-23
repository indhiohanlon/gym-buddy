import React from "react";
import { TextInput, StyleSheet } from "react-native";

//formatting text input field
const TextInputField = (props) => {
  return (
    <TextInput
      autoCapitalize="none"
      {...props}
      style={[styles.textInput, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#ddd",
  },
});

export default TextInputField;
