import React from "react";
import { Text, StyleSheet } from "react-native";

//style for all headers parsing children as it is for text
const HeaderText = ({ children }) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    fontSize: 26,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default HeaderText;
