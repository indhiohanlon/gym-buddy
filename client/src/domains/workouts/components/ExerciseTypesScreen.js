import React, { useContext, useEffect, useState } from "react";
import { FlatList, Button, Text, View, SafeAreaView } from "react-native";
import { SearchInputField } from "../../../common/components";
import { NewWorkoutTypeContext } from "../../../Routes";
import { ExerciseTypesContext } from "../../../Routes";
import { useRequest } from "../../../common/hooks";

const ExerciseTypesScreen = () => {
  const request = useRequest();
  const [isLoading, setIsLoading] = useState(false);
  const { exerciseTypes, setExerciseTypes } = useContext(ExerciseTypesContext);
  const { newWorkoutType, setNewWorkoutType } = useContext(
    NewWorkoutTypeContext
  );
  //state for a searchFilter that updates when user inputs text
  const [searchFilter, setSearchFilter] = useState("");

  //decides what exercises to show depending on the users inputted text
  const filteredExerciseTypes = exerciseTypes.filter(
    (exerciseType) =>
      exerciseType.name
        .toLowerCase()
        .replace(" ", "")
        .indexOf(searchFilter.toLowerCase().replace(" ", "")) !== -1
  );

  //requests from the server all the exercise types and updates state
  const fetchExerciseTypes = async () => {
    setIsLoading(true);
    const { result } = await request("exerciseTypes");
    setExerciseTypes(result);
    setIsLoading(false);
  };
  //updates searchfilter state
  const handleSearchInputFieldChange = (text) => {
    setSearchFilter(text);
  };

  //adds exercises to newWorkoutType array that can be seen in the previous page
  const makeAddToNewWorkoutTypesHandler = (id) => () => {
    setNewWorkoutType({
      ...newWorkoutType,
      exerciseTypes: [...newWorkoutType.exerciseTypes, id],
    });
  };

  //takes all objects from newWorkoutType and filters so that only selected ones show
  //effectively allowing user to remove an exercise
  const makeRemoveFromNewWorkoutTypesHandler = (id) => () => {
    setNewWorkoutType({
      ...newWorkoutType,
      exerciseTypes: newWorkoutType.exerciseTypes.filter(
        (itemId) => itemId !== id
      ),
    });
  };

  useEffect(() => {
    fetchExerciseTypes();
  }, []);
  //input form for user to search for exercises
  //all exercises are displayed before user adds filter
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchInputField
        placeholder="Search..."
        value={searchFilter}
        onChangeText={handleSearchInputFieldChange}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : //checking that exercise types exists in the filteredExerciseTypes array
      filteredExerciseTypes.length ? (
        <FlatList
          //flat list allows user to scroll through the listed data
          data={filteredExerciseTypes}
          renderItem={({ item }) => {
            //array that holds exercise types the user has selected
            const isInWorkoutTypesArray =
              newWorkoutType?.exerciseTypes?.indexOf(item.id) !== -1;
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                {/* formatting the exercise types selected by the user */}
                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: isInWorkoutTypesArray ? "bold" : "normal",
                  }}
                >
                  {item.name}
                </Text>
                {isInWorkoutTypesArray ? (
                  <Button
                    title="-"
                    onPress={makeRemoveFromNewWorkoutTypesHandler(item.id)}
                  />
                ) : (
                  <Button
                    title="+"
                    onPress={makeAddToNewWorkoutTypesHandler(item.id)}
                  />
                )}
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      ) : //if no matching exercise types to the users input
      searchFilter ? (
        <Text>No Exercise Types Matching {searchFilter}...</Text>
      ) : (
        <Text>No Exercise Types Available...</Text>
      )}
    </SafeAreaView>
  );
};

ExerciseTypesScreen.SCREEN_NAME = "ExerciseTypesScreen";

export default ExerciseTypesScreen;
