import React from "react";
import { TextInput, StyleSheet } from "react-native";

//formatting data input field
const DataInputField = (props) => {
  return (
    <TextInput autoCapitalize="none" {...props} style={[styles.dataInput]} />
  );
};

const styles = StyleSheet.create({
  dataInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 4,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,

    backgroundColor: "white",
  },
});

export default DataInputField;
