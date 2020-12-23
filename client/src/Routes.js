import React, { useState } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "./domains/auth/components/LoginScreen";
import RegistrationScreen from "./domains/auth/components/RegistrationScreen";
import HomeScreen from "./domains/landing/components/HomeScreen";
import WorkoutsScreen from "./domains/workouts/components/WorkoutsScreen";
import CreateWorkoutScreen from "./domains/workouts/components/CreateWorkoutScreen";
import WorkoutScreen from "./domains/workouts/components/WorkoutScreen";
import ExerciseTypesScreen from "./domains/workouts/components/ExerciseTypesScreen";
import CreateWorkoutTypeScreen from "./domains/workouts/components/CreateWorkoutTypeScreen";
import CreateWorkoutSummaryScreen from "./domains/workouts/components/CreateWorkoutSummaryScreen";
import AccountRecoveryScreen from "./domains/auth/components/AccountRecoveryScreen";
import AccountRecoveryPasswordScreen from "./domains/auth/components/AccountRecoveryPasswordScreen";

const Stack = createStackNavigator();

export const UserContext = React.createContext(null);
export const ExerciseTypesContext = React.createContext(null);
export const NewWorkoutTypeContext = React.createContext(null);

const Routes = () => {
  const [user, setUser] = useState(null);
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [newWorkoutType, setNewWorkoutType] = useState({
    name: "",
    exerciseTypes: [],
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ExerciseTypesContext.Provider
        value={{ exerciseTypes, setExerciseTypes }}
      >
        <NewWorkoutTypeContext.Provider
          value={{ newWorkoutType, setNewWorkoutType }}
        >
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={LoginScreen.SCREEN_NAME}
                screenOptions={{
                  headerTitleStyle: {
                    color: "transparent",
                  },
                  headerStyle: {
                    backgroundColor: "transparent",
                  },
                  cardStyle: {
                    backgroundColor: "white",
                  },
                  headerBackTitle: "Back",
                }}
              >
                <Stack.Screen
                  name={AccountRecoveryScreen.SCREEN_NAME}
                  component={AccountRecoveryScreen}
                />
                <Stack.Screen
                  name={AccountRecoveryPasswordScreen.SCREEN_NAME}
                  component={AccountRecoveryPasswordScreen}
                />
                <Stack.Screen
                  name={LoginScreen.SCREEN_NAME}
                  component={LoginScreen}
                />
                <Stack.Screen
                  name={RegistrationScreen.SCREEN_NAME}
                  component={RegistrationScreen}
                />
                <Stack.Screen
                  name={HomeScreen.SCREEN_NAME}
                  options={{ headerLeft: () => null }}
                  component={HomeScreen}
                />
                <Stack.Screen
                  name={WorkoutsScreen.SCREEN_NAME}
                  options={{ headerLeft: () => null }}
                  component={WorkoutsScreen}
                />
                <Stack.Screen
                  name={CreateWorkoutTypeScreen.SCREEN_NAME}
                  component={CreateWorkoutTypeScreen}
                />
                <Stack.Screen
                  name={WorkoutScreen.SCREEN_NAME}
                  component={WorkoutScreen}
                />
                <Stack.Screen
                  name={ExerciseTypesScreen.SCREEN_NAME}
                  options={{
                    headerTitleStyle: {
                      color: "black",
                    },
                  }}
                  component={ExerciseTypesScreen}
                />
                <Stack.Screen
                  name={CreateWorkoutScreen.SCREEN_NAME}
                  component={CreateWorkoutScreen}
                />
                <Stack.Screen
                  name={CreateWorkoutSummaryScreen.SCREEN_NAME}
                  component={CreateWorkoutSummaryScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </NewWorkoutTypeContext.Provider>
      </ExerciseTypesContext.Provider>
    </UserContext.Provider>
  );
};

export default Routes;
