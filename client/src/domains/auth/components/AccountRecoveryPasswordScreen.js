import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-native";
import {
  CenterContainer,
  HeaderText,
  SubHeadingText,
  TextInputField,
} from "../../../common/components";
import { request } from "../../../common/utilities";
import { UserContext } from "../../../Routes";
import HomeScreen from "../../landing/components/HomeScreen";

//defining a screen for account recovery
const AccountRecoveryPasswordScreen = () => {
  //allow screen navigaiton
  const navigation = useNavigation();
  //global scope context for user
  const { user, setUser } = useContext(UserContext);
  //creating state for password to be updated
  const [password, setPassword] = useState("");

  //function that handles the user changing the password
  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  //function that updates/posts to the server users password in users.json
  const handleSaveNewPasswordClick = async () => {
    try {
      //selecting path and body with a post method
      const response = await request(`account_recovery/${user.id}`, {
        method: "post",
        body: { password, resetCode: user.resetCode },
      });
      //error handling...
      if (response.error) {
        alert("Error Reseting Password.");
      } else {
        setPassword("");

        alert("Password Successfully Reset...");

        setUser(response.result);

        navigation.navigate(HomeScreen.SCREEN_NAME);
      }
    } catch (error) {
      alert("Something went VERY wrong.");
    }
  };
  //rendering an input form for user to enter new password
  return (
    <CenterContainer>
      <HeaderText>Reset Your Password</HeaderText>
      <SubHeadingText>Please enter your new password.</SubHeadingText>
      <TextInputField
        //input field that takes a value for users input and button to run function that handles new passowrd
        placeholder={"New Password"}
        value={password}
        onChangeText={handlePasswordChange}
      />
      <Button title="Save New Password" onPress={handleSaveNewPasswordClick} />
    </CenterContainer>
  );
};

//creating a more efficient way of calling this page...
AccountRecoveryPasswordScreen.SCREEN_NAME = "AccountRecoveryPasswordScreen";

export default AccountRecoveryPasswordScreen;
