import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { request } from "../../../common/utilities";
import { Button, SafeAreaView, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { HeaderText, SearchInputField } from "../../../common/components";
import HomeScreen from "../../landing/components/HomeScreen";
import WorkoutScreen from "./WorkoutScreen";
import { useRequest } from "../../../common/hooks";

const WorkoutsScreen = () => {
  const request = useRequest();
  const [searchFilter, setSearchFilter] = useState("");
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const filteredWorkoutTypes = workoutTypes.filter(
    (workoutType) =>
      workoutType.name
        .toLowerCase()
        .replace(" ", "")
        .indexOf(searchFilter.toLowerCase().replace(" ", "")) !== -1
  );

  //fetches the workout types from the server that are associated with the user
  const fetchWorkoutTypes = async () => {
    setIsLoading(true);
    const response = await request("workoutTypes");
    if (response.error) {
      alert(response.error);
    } else {
      setWorkoutTypes(response.result);
    }
    setIsLoading(false);
  };

  const handleSearchInputFieldChange = (text) => {
    setSearchFilter(text);
  };

  //decides what workout has been selected when pressed by the user
  const makeSelectedWorkoutHandler = (workoutTypeId) => () => {
    //parsing the workoutTypeId as an object
    navigation.navigate(WorkoutScreen.SCREEN_NAME, { workoutTypeId });
  };

  useEffect(() => {
    fetchWorkoutTypes();
  }, []);

  //displays the workouts fetched from the sever and allows user to filter through them
  return (
    <SafeAreaView>
      <HeaderText>Workouts</HeaderText>
      <SearchInputField
        placeholder="Search..."
        value={searchFilter}
        onChangeText={handleSearchInputFieldChange}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : filteredWorkoutTypes.length ? (
        <FlatList
          data={filteredWorkoutTypes}
          renderItem={({ item }) => {
            return (
              <View>
                <Button
                  title={item.name}
                  onPress={makeSelectedWorkoutHandler(item.id)}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      ) : searchFilter ? (
        <Text>No Workout Types Matching {searchFilter}...</Text>
      ) : (
        <Text>No Workout Types Available...</Text>
      )}
      <Button
        title="Home"
        onPress={() => {
          navigation.navigate(HomeScreen.SCREEN_NAME);
        }}
      />
    </SafeAreaView>
  );
};

WorkoutsScreen.SCREEN_NAME = "WorkoutsScreen";

export default WorkoutsScreen;
