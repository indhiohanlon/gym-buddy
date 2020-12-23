import React, { useContext, useEffect, useState } from "react";
import { Button, View, Text } from "react-native";
import {
  CenterContainer,
  DataInputField,
  HeaderText,
  SubHeadingText,
} from "../../../common/components";
import { useRequest } from "../../../common/hooks";
import { ExerciseTypesContext, NewWorkoutTypeContext } from "../../../Routes";
import ExerciseTypesScreen from "./ExerciseTypesScreen";
import WorkoutsScreen from "./WorkoutsScreen";

//creating the screen for creating a workout Type
const CreateWorkoutTypeScreen = ({ navigation }) => {
  const request = useRequest();
  const [isLoading, setIsLoading] = useState(false);
  //context for exercise types and newWorkoutType so they can be accessed easily
  const { exerciseTypes, setExerciseTypes } = useContext(ExerciseTypesContext);
  const { newWorkoutType, setNewWorkoutType } = useContext(
    NewWorkoutTypeContext
  );

  //request to the sever that fetches the exercise types stored in the relevant file path
  const fetchExerciseTypes = async () => {
    setIsLoading(true);
    const response = await request("exerciseTypes");
    setExerciseTypes(response.result);
    setIsLoading(false);
  };

  //creates a name for the workout and updates the context
  const handleNameChange = (text) => {
    setNewWorkoutType({ ...newWorkoutType, name: text });
  };
  //posts the new workout type to the server file path taking a body of the updated newWorkoutType
  const handleCreateNewWorkoutTypePress = async () => {
    try {
      const response = await request("createWorkoutType", {
        method: "post",
        body: newWorkoutType,
      });

      if (response.error) {
        console.log("error", response.error);
        alert("Error creating workout type.");
      } else {
        alert("Workout Type Created...");
        setNewWorkoutType({});
        navigation.navigate(WorkoutsScreen.SCREEN_NAME);
      }
    } catch (error) {
      console.log("error", error);
      alert("Something went VERY wrong.");
    }
  };
  //initial rendering of screen
  useEffect(() => {
    fetchExerciseTypes();
  }, []);

  //input form for user to enter a name for the workout and go to a page to add exercises
  return (
    <CenterContainer>
      <HeaderText>Create New Workout Type</HeaderText>
      <DataInputField
        placeholder="Workout Title"
        value={newWorkoutType.name}
        onChangeText={handleNameChange}
      />
      <SubHeadingText>Exercise Types:</SubHeadingText>
      {/* checks if any exercise types have been added to the newWorkoutType yet */}
      {isLoading ? (
        <Text>Loading Exercise Types...</Text>
      ) : newWorkoutType?.exerciseTypes?.length ? (
        <View>
          {/* lists each exercise */}
          {newWorkoutType.exerciseTypes.map((exerciseTypeId) => (
            <View key={exerciseTypeId}>
              <Text>
                {exerciseTypes.find(({ id }) => id === exerciseTypeId).name}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No Exercise Types have been added.</Text>
      )}
      {/* button that takes user to exerciseTypes screen ot add exercise types ot workout */}
      <Button
        title="Add Exercise Type"
        onPress={() => {
          navigation.navigate(ExerciseTypesScreen.SCREEN_NAME);
        }}
      />
      {/* button that finalises the workout and runs the post to the server */}
      <Button
        title="Create Workout Type"
        onPress={handleCreateNewWorkoutTypePress}
      />
    </CenterContainer>
  );
};

CreateWorkoutTypeScreen.SCREEN_NAME = "CreateWorkoutTypeScreen";

export default CreateWorkoutTypeScreen;
