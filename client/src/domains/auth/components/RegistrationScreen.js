import React, { useState } from "react";
import { Button } from "react-native";
import {
  CenterContainer,
  HeaderText,
  SubHeadingText,
  TextInputField,
  PasswordInputField,
} from "../../../common/components";
import { request } from "../../../common/utilities";
import LoginScreen from "./LoginScreen";

//creating a screen for sign up
const RegistrationScreen = ({ navigation }) => {
  //using state
  const [inputData, setInputData] = useState({});

  const makeInputTextChangeHandler = (key) => (text) => {
    //taking data out of current state and adding it to new state with a pre defined 'key' for each value
    setInputData({ ...inputData, [key]: text });
  };

  //function that sends a request to the server sending the body which is stored in state
  const handleCreateAccountPress = async () => {
    try {
      const response = await request("signup", {
        method: "post",
        body: inputData,
      });
      //error handling
      if (response.error) {
        alert("Error creating account.");
      } else {
        setInputData({});

        alert("Account Created...");

        navigation.navigate(LoginScreen.SCREEN_NAME);
      }
    } catch (error) {
      alert("Something went VERY wrong.");
    }
  };

  //creating the input form for the sign in page
  return (
    <CenterContainer>
      <HeaderText>Sign Up</HeaderText>
      <SubHeadingText>All fields are required</SubHeadingText>
      <TextInputField
        placeholder={"First Name"}
        //assigning users input to a key within the inputData state
        value={inputData.firstName}
        //parsing the name of the key field
        onChangeText={makeInputTextChangeHandler("firstName")}
      />
      <TextInputField
        placeholder={"Last Name"}
        value={inputData.lastName}
        onChangeText={makeInputTextChangeHandler("lastName")}
      />
      <TextInputField
        placeholder={"Email Address"}
        value={inputData.email}
        onChangeText={makeInputTextChangeHandler("email")}
      />
      <PasswordInputField
        placeholder={"Password"}
        value={inputData.password}
        onChangeText={makeInputTextChangeHandler("password")}
      />
      {/* button that handles when the button is pressed and runs the associated function */}
      <Button title="Create Account" onPress={handleCreateAccountPress} />
    </CenterContainer>
  );
};

RegistrationScreen.SCREEN_NAME = "RegistrationScreen";

export default RegistrationScreen;
