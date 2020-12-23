import React from "react";
import TextInputField from "./TextInputField";

//formats input fields that will be used for passwords
const PasswordInputField = (props) => {
  return <TextInputField {...props} secureTextEntry={true} />;
};

export default PasswordInputField;
