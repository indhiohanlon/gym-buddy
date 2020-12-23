import union from "lodash.union";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { CenterContainer, HeaderText } from "../../../common/components";
import { ExerciseTypesContext } from "../../../Routes";
import CreateWorkoutScreen from "./CreateWorkoutScreen";
import HomeScreen from "../../landing/components/HomeScreen";
import { useRequest } from "../../../common/hooks";

const WorkoutScreen = () => {
  const request = useRequest();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentWorkoutType, setCurrentWorkoutType] = useState(null);
  const { exerciseTypes, setExerciseTypes } = useContext(ExerciseTypesContext);
  const route = useRoute();
  //taking the object parsed from the last route
  const { workoutTypeId } = route.params;

  //gets the workout type from the server
  const fetchWorkoutType = async () => {
    setIsLoading(true);
    const response = await request(`workoutType/${workoutTypeId}`);

    if (response.error) {
      //status code for an unauthorised access to workout not created by user
      if (response.status === 401) {
        //sends user back to homescreen
        navigation.navigate(HomeScreen.SCREEN_NAME);
      }
      alert(response.error);
    } else {
      const { result } = response;
      //using function 'union'' to combine contents of two arrays
      setExerciseTypes(union(exerciseTypes, result.exerciseTypes));
      setCurrentWorkoutType(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWorkoutType();
  }, [workoutTypeId]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!currentWorkoutType) {
    return <Text>No Workout Type</Text>;
  }

  return (
    <CenterContainer>
      {/* displays exercise types for selected workout */}
      <HeaderText>{currentWorkoutType.name}</HeaderText>
      {currentWorkoutType.exerciseTypes.map((exerciseType) => (
        <Text key={exerciseType.id}>{exerciseType.name}</Text>
      ))}
      <Button
        title="Begin Workout"
        onPress={() => {
          //navigates to the createworkoutscreen and passes the workoutTypeId with it
          navigation.navigate(CreateWorkoutScreen.SCREEN_NAME, {
            workoutTypeId,
          });
        }}
      />
    </CenterContainer>
  );
};

WorkoutScreen.SCREEN_NAME = "WorkoutScreen";

export default WorkoutScreen;
