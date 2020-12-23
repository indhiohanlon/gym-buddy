import { useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import {
  CenterContainer,
  DataInputField,
  HeaderText,
} from "../../../common/components";
import { useRequest } from "../../../common/hooks";
import { ExerciseTypesContext } from "../../../Routes";
import CreateWorkoutSummaryScreen from "./CreateWorkoutSummaryScreen";

//creating the screen for a user to create a new workout
const CreateWorkoutScreen = ({ navigation }) => {
  //making use of the custom hook i made so the workout is only available for the user who made it
  const request = useRequest();
  //using route hook to take objects parsed from previous screen
  const route = useRoute();
  const { workoutTypeId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const { exerciseTypes, setExerciseTypes } = useContext(ExerciseTypesContext);
  const [currentWorkoutType, setCurrentWorkoutType] = useState(null);
  const [newWorkout, setNewWorkout] = useState(null);

  //function that provides the fields for the user to enter data
  const getBlankNewWorkout = () => ({
    workoutTypeId,
    exercises: currentWorkoutType.exerciseTypes.map((exerciseType) => ({
      exerciseTypeId: exerciseType.id,
    })),
  });

  //fetches the workout that has been selected from the server with exercise types
  const fetchWorkoutType = async () => {
    //updating state
    setIsLoading(true);
    const { result } = await request(`workoutType/${workoutTypeId}`);
    //updating state
    setExerciseTypes([
      ...result.exerciseTypes,
      ...exerciseTypes.filter(
        (exerciseType) =>
          !result.exerciseTypes.some(({ id }) => id === exerciseType.id)
      ),
    ]);
    setCurrentWorkoutType(result);
    setIsLoading(false);
  };
  //takes the data the user inputs and assigns it to the relevant key and updates the state
  const makeInputChangeHandler = (key, inputIndex) => (text) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.map((exercise, index) =>
        index === inputIndex
          ? {
              ...exercise,
              [key]: text,
            }
          : exercise
      ),
    });
  };

  const handleCreateWorkout = async () => {
    try {
      // send a post request with our state
      const response = await request("createWorkout", {
        method: "post",
        body: { ...newWorkout },
      });

      if (response.error) {
        console.log("error", response.error);
        alert("Error creating workout type.");
      } else {
        alert("Workout Created...");
        // clear the state
        setNewWorkout(getBlankNewWorkout());

        // navigate to the workout summary screen
        navigation.navigate(CreateWorkoutSummaryScreen.SCREEN_NAME);
      }
    } catch (error) {
      console.log("error", error);
      alert("Something went VERY wrong.");
    }
  };

  //sets the initial render for the page
  useEffect(() => {
    fetchWorkoutType();
  }, [workoutTypeId]);

  useEffect(() => {
    if (currentWorkoutType) {
      setNewWorkout(getBlankNewWorkout());
    }
  }, [currentWorkoutType]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!currentWorkoutType) {
    return <Text>No Workout Type</Text>;
  }

  if (!newWorkout) {
    return null;
  }

  //creating the input form for users to enter in their data
  return (
    <CenterContainer>
      <HeaderText>{currentWorkoutType.name}</HeaderText>
      {currentWorkoutType.exerciseTypes.map((exerciseType, index) => (
        <View key={exerciseType.id}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            {exerciseType.name}
          </Text>
          <DataInputField
            placeholder="Weight"
            //updates the state with a relevant key provided here
            onChangeText={makeInputChangeHandler("weight", index)}
            value={newWorkout.exercises[index].weight}
          />
          <DataInputField
            placeholder="Sets"
            onChangeText={makeInputChangeHandler("sets", index)}
            value={newWorkout.exercises[index].sets}
          />
          <DataInputField
            placeholder="Reps"
            onChangeText={makeInputChangeHandler("reps", index)}
            value={newWorkout.exercises[index].reps}
          />
        </View>
      ))}
      {/* makes use of the handleCreateWorkout function and finalising the data inputted to the server */}
      <Button title="Finish Workout" onPress={handleCreateWorkout} />
    </CenterContainer>
  );
};

CreateWorkoutScreen.SCREEN_NAME = "CreateWorkoutScreen";

export default CreateWorkoutScreen;
