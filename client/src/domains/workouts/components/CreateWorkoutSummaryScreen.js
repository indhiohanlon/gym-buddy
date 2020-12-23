import React from "react";
import { Button, Text } from "react-native";
import { CenterContainer, HeaderText } from "../../../common/components";
import HomeScreen from "../../landing/components/HomeScreen";

//screen that confirms workout has been completed
const CreateWorkoutSummaryScreen = ({ navigation }) => (
  <CenterContainer>
    <HeaderText>Workout Completed</HeaderText>
    {/* button that takes you home */}
    <Button
      title="Home"
      onPress={() => {
        navigation.navigate(HomeScreen.SCREEN_NAME);
      }}
    />
  </CenterContainer>
);

CreateWorkoutSummaryScreen.SCREEN_NAME = "CreateWorkoutSummaryScreen";

export default CreateWorkoutSummaryScreen;
