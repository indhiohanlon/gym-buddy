import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Button } from "react-native";
import {
  CenterContainer,
  HeaderText,
  SubHeadingText,
  TextInputField,
} from "../../../common/components";
import { request } from "../../../common/utilities";
import { UserContext } from "../../../Routes";
import AccountRecoveryPasswordScreen from "./AccountRecoveryPasswordScreen";

//creating the screen for account recovery
//user enters an email and is 'sent' a reset code
//for now the console just logs the reset code the user would be sent
const AccountRecoveryScreen = () => {
  //using the navigation hook to allow for page navigation
  const navigation = useNavigation();
  //global context so we can set the user
  const { setUser } = useContext(UserContext);
  //using state
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetCodeWasSent, setResetCodeWasSent] = useState(false);

  //function that handles the reset code
  const handleResetCodeChange = (text) => {
    setResetCode(text);
  };

  //decides the email that is being used
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  //function that handles the event that occur when the send reset code button is clicked
  const handleSendResetCodeClick = async () => {
    try {
      //awaiting a request to the server to check the email
      const response = await request("account_recovery", {
        method: "post",
        body: { email },
      });
      //error handling...
      if (response.error) {
        alert("There was a problem sending a password reset code.");
      } else {
        setResetCodeWasSent(true);

        alert("A password reset link has been sent, please check your emails.");
      }
    } catch (error) {
      alert("Something went VERY wrong.");
    }
  };

  //function that comfirms whether the reset code matches the one assigned to the user
  const handleConfirmResetCode = async () => {
    try {
      //sending a request to the server with the email and reset code the user entered
      const response = await request(`account_recovery_code`, {
        method: "post",
        body: { email, resetCode },
      });
      //error handling...
      if (response.error) {
        alert("The recovery code you entered was incorrect.");
      } else {
        alert("Please reset your password below.");
        setUser(response.result);
        navigation.navigate(AccountRecoveryPasswordScreen.SCREEN_NAME);
      }
    } catch (error) {
      alert("Something went VERY wrong.");
    }
  };

  //creating an input form for user to enter the reset code they recieved
  return (
    <CenterContainer>
      <HeaderText>Account Recovery</HeaderText>
      {/* if a reset code has been sent show a form to enter code */}
      {resetCodeWasSent ? (
        <>
          <SubHeadingText>
            We've just sent you a reset password code, enter it below...
          </SubHeadingText>
          <TextInputField
            // input field that handles when text is inputted
            placeholder={"Reset Code"}
            value={resetCode}
            onChangeText={handleResetCodeChange}
          />
          <Button title="Confirm Reset Code" onPress={handleConfirmResetCode} />
        </>
      ) : (
        // else ask for an email so reset code can be sent
        <>
          <SubHeadingText>
            Please enter your email and we will send you a password reset code.
          </SubHeadingText>
          <TextInputField
            placeholder={"Email Address"}
            value={email}
            onChangeText={handleEmailChange}
          />
          <Button title="Send Reset Code" onPress={handleSendResetCodeClick} />
        </>
      )}
    </CenterContainer>
  );
};

AccountRecoveryScreen.SCREEN_NAME = "AccountRecoveryScreen";

export default AccountRecoveryScreen;
