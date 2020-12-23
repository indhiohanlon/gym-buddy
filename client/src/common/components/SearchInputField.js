import React from "react";
import { TextInput, StyleSheet } from "react-native";
import TextInputField from "./TextInputField";
//formatting search input field
const SearchInputField = (props) => {
  return <TextInputField {...props} style={styles.searchInput} />;
};

const styles = StyleSheet.create({
  searchInput: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 4,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "white",
  },
});

export default SearchInputField;
