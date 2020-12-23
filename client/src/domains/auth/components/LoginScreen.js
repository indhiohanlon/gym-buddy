import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-native";
import {
  CenterContainer,
  HeaderText,
  PasswordInputField,
  SubHeadingText,
  TextInputField,
} from "../../../common/components";
import { request } from "../../../common/utilities";
import { UserContext } from "../../../Routes";
import HomeScreen from "../../landing/components/HomeScreen";
import AccountRecoveryScreen from "./AccountRecoveryScreen";
import RegistrationScreen from "./RegistrationScreen";

//creating a login screen for navigation
const LoginScreen = ({ navigation }) => {
  //using state and context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  //functions that handle the users input and update the state
  const handleEmailTextChange = (text) => {
    setEmail(text);
  };

  const handlePasswordTextChange = (text) => {
    setPassword(text);
  };

  //function that handles when the sign in button is pressed
  //creates a request to the server to check that the email and password matches
  const signInButtonHandler = async () => {
    try {
      const response = await request("authenticate", {
        method: "post",
        body: {
          email,
          password,
        },
      });
      //error handling...
      if (response.error) {
        alert("Incorrect Email Address or Password.");
      } else {
        //updating state so the the fields are cleared for input again
        setPassword("");
        setUser(response.result);
        navigation.navigate(HomeScreen.SCREEN_NAME);
      }
    } catch (error) {
      alert("Something went VERY wrong.");
    }
  };
  //takes user to the sign up page using navigation
  const signUpButtonHandler = () => {
    navigation.navigate(RegistrationScreen.SCREEN_NAME);
  };
  //takes user to account recovery page
  const handleAccountRecoveryClick = () => {
    navigation.navigate(AccountRecoveryScreen.SCREEN_NAME);
  };
  //creating the input form to take the users email and password
  return (
    <CenterContainer>
      <HeaderText>Login</HeaderText>
      <SubHeadingText>Enter Email Address and Password</SubHeadingText>
      <TextInputField
        value={email}
        placeholder={"Email Address"}
        //calling those functions that update the state
        onChangeText={handleEmailTextChange}
      />
      <PasswordInputField
        value={password}
        placeholder={"Password"}
        onChangeText={handlePasswordTextChange}
      />
      {/* calling the functions that handle the requests to the server */}
      <Button title="Sign In" onPress={signInButtonHandler} />
      <Button title="Sign Up" onPress={signUpButtonHandler} />
      <Button
        title="Forgot Your Password?"
        onPress={handleAccountRecoveryClick}
      />
    </CenterContainer>
  );
};

LoginScreen.SCREEN_NAME = "LoginScreen";

export default LoginScreen;
