import React, { useContext } from "react";
import { Button } from "react-native";
import { CenterContainer, HeaderText } from "../../../common/components";
import { UserContext } from "../../../Routes";
import LoginScreen from "../../auth/components/LoginScreen";
import CreateWorkoutTypeScreen from "../../workouts/components/CreateWorkoutTypeScreen";
import WorkoutsScreen from "../../workouts/components/WorkoutsScreen";

const HomeScreen = ({ navigation }) => {
  //using the context hook to gain access the the user logged on
  const { user } = useContext(UserContext);

  return (
    <CenterContainer>
      {/* using the context provided to greet the user */}
      <HeaderText>Hi, {user.firstName}</HeaderText>
      {/* navigational buttons for the app */}
      <Button
        title="View Workouts"
        onPress={() => {
          navigation.navigate(WorkoutsScreen.SCREEN_NAME);
        }}
      />
      <Button
        title="New Workout"
        onPress={() => {
          navigation.navigate(CreateWorkoutTypeScreen.SCREEN_NAME);
        }}
      />
      <Button
        title="Sign Out"
        onPress={() => {
          navigation.navigate(LoginScreen.SCREEN_NAME);
        }}
      />
    </CenterContainer>
  );
};

HomeScreen.SCREEN_NAME = "HomeScreen";

export default HomeScreen;
