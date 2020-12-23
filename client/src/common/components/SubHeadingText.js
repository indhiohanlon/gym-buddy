import React from "react";
import { Text, StyleSheet } from "react-native";

//formatting for subheadings parsing children for text
const SubHeadingText = ({ children }) => (
  <Text style={styles.subHeading}>{children}</Text>
);

const styles = StyleSheet.create({
  subHeading: {
    fontWeight: "bold",
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default SubHeadingText;
