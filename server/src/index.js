import express from "express";
import morgan from "morgan";
import { v4 as uuid } from "uuid";
import { readFile, writeFile } from "./utilities/index.js";
import { PORT } from "./constants/index.js";

// set up the app.
const app = express();

// make the app use morgan as a logging tool.
app.use(morgan("combined"));

// make sure the app can accept json format in it's requests.
app.use(express.json());

// define the name of the users file.
const USERS_FILE_PATH = "users.json";
const EXERCISE_TYPES_FILE_PATH = "exerciseTypes.json";
const WORKOUT_TYPES_FILE_PATH = "workoutTypes.json";
const WORKOUTS_FILE_PATH = "workouts.json";
const EXERCISES_FILE_PATH = "exercises.json";

app.post("/api/createWorkoutType", async (request, response) => {
  // get the userId from request headers
  const { authorization } = request.headers;

  const { name, exerciseTypes } = request.body;
  const workoutTypes = await readFile(WORKOUT_TYPES_FILE_PATH);
  if (!name) {
    return response.status(422).json({ error: "Name is required." });
  }

  if (!exerciseTypes || !exerciseTypes.length) {
    return response.status(422).json({ error: "Exercise Types are required." });
  }

  const nameAlreadyExists = workoutTypes.find(
    (workoutType) => workoutType.name === name
  );

  if (!nameAlreadyExists) {
    const newWorkoutType = {
      id: uuid(),
      name,
      exerciseTypes,
      userId: authorization,
    };

    workoutTypes.push(newWorkoutType);
    writeFile(WORKOUT_TYPES_FILE_PATH, workoutTypes);
    //return status codes for errors
    return response.status(201).json({ result: newWorkoutType });
  } else {
    return response.status(409).json({ error: "Workout already exists." });
  }
});

app.post("/api/createWorkout", async (request, response) => {
  // get the userId from request headers
  const { authorization } = request.headers;

  // get the data the client sent in request body
  const { workoutTypeId, exercises } = request.body;

  // read the exercise file
  const exercisesArray = await readFile(EXERCISES_FILE_PATH);

  // create new exercise instances for each exercise sent
  const newExercises = exercises.map((exercise) => ({
    ...exercise,
    id: uuid(),
    date: new Date(),
    userId: authorization,
  }));

  // add the new exercises to our exercises from the file
  const newExercisesArray = [...exercisesArray, ...newExercises];

  // write all the exercises to the exercises file
  writeFile(EXERCISES_FILE_PATH, newExercisesArray);

  // read the workouts file
  const workoutsArray = await readFile(WORKOUTS_FILE_PATH);

  // create a new workout which uses the id's from the new exercises we've created
  const newWorkout = {
    id: uuid(),
    workoutTypeId,
    exercises: newExercises.map(({ id }) => id),
    userId: authorization,
  };

  // add the new workout to our workouts from the file
  workoutsArray.push(newWorkout);

  // write all the workouts to the workouts file
  writeFile(WORKOUTS_FILE_PATH, workoutsArray);

  // re-add the full exercises array ready for our response.
  const newWorkoutWithExercises = { ...newWorkout, exercises: newExercises };

  // return a successful response with the id of the new workout
  return response.status(201).json({ result: newWorkoutWithExercises });
});

// set up a post endpoint for creating a new user (signup).
app.post("/api/signup", async (request, response) => {
  // get the parameters that were sent in the request.
  const { email, password, firstName, lastName } = request.body;

  // read the users file into memory.
  const users = await readFile(USERS_FILE_PATH);

  // convert the email from the request to lowercase.
  const lowercaseEmail = email.toLowerCase();

  // find the user with an email that matches the email sent in the request.
  const user = users.find((user) => user.email === lowercaseEmail);

  // if there isn't already a user with the email sent in the request.
  if (!user) {
    // create a new user with the parameters sent in the request.
    // use the uuid function to generate a unique id.
    const newUser = {
      id: uuid(),
      firstName,
      lastName,
      email: lowercaseEmail,
      password,
    };

    // add the newly created user to the users array.
    users.push(newUser);

    // write the updated array to the users.json file.
    writeFile(USERS_FILE_PATH, users);

    // send a 201 status code (resource was created)
    // send the newly created user back to the client in json format.
    response.status(201).json({ result: user });
  } else {
    // send back a 409 status code (resource already exists).
    // send back an error message stating the user already exists.
    response.status(409).json({ error: "User already exists." });
  }
});

// set up a post endpoint for authenticating a user given username and password.
app.post("/api/authenticate", async (request, response) => {
  // get the parameters that were sent in the request.
  const { email, password } = request.body;

  // read the users file into memory.
  const users = await readFile(USERS_FILE_PATH);

  // convert the email from the request to lowercase.
  const lowercaseEmail = email.toLowerCase();

  // find the user with an email that matches the email sent in the request.
  const user = users.find((user) => user.email === lowercaseEmail);

  // if a user exists with the email sent in the request.
  // and the password for the user matching the email address is the same as the password sent in the request.
  if (user && user.password === password) {
    // send back a 200 status code (generic success).
    // send back the newly created user back to the client in json format.
    response.status(200).json({ result: user });
  } else {
    // send back a 401 status code (authentication failed).
    // send back a json object with an error message.
    response.status(401).json({ error: "Authentication Failed" });
  }
});

//async function that 'gets' the exercise types and returns them
app.get("/api/exerciseTypes", async (response) => {
  const exerciseTypes = await readFile(EXERCISE_TYPES_FILE_PATH);
  if (exerciseTypes) {
    response.status(200).json({ result: exerciseTypes });
  } else {
    response.status(200).json({ result: [] });
  }
});

app.get("/api/workoutTypes", async (request, response) => {
  // get the userId from request headers
  const { authorization } = request.headers;
  //checks user is authorized
  if (!authorization) {
    response.status(401).json({ error: "Not authorized" });
    return;
  }
  //function for workout types that user is authorised for
  const workoutTypes = await readFile(WORKOUT_TYPES_FILE_PATH);
  if (workoutTypes) {
    response.status(200).json({
      result: workoutTypes.filter(({ userId }) => userId === authorization),
    });
  } else {
    response.status(200).json({ result: [] });
  }
});

app.get("/api/workoutType/:id", async (request, response) => {
  // get the userId from request headers
  const { authorization } = request.headers;

  if (!authorization) {
    response.status(401).json({ error: "Not authorized" });
    return;
  }

  const { id } = request.params;
  const exerciseTypes = await readFile(EXERCISE_TYPES_FILE_PATH);
  const workoutTypes = await readFile(WORKOUT_TYPES_FILE_PATH);

  if (exerciseTypes && workoutTypes) {
    const workoutType = workoutTypes.find(
      (workoutType) => workoutType.id === id
    );

    if (workoutType.userId !== authorization) {
      response.status(401).json({ error: "Not authorized" });
      return;
    }

    if (workoutType) {
      const result = {
        ...workoutType,
        exerciseTypes: workoutType.exerciseTypes.map((exerciseTypeId) =>
          exerciseTypes.find(
            (exerciseType) => exerciseType.id === exerciseTypeId
          )
        ),
      };
      return response.status(200).json({ result });
    }
  }

  return response
    .status(404)
    .json({ error: "No workout type with this id exists" });
});

app.post("/api/account_recovery/:id", async (request, response) => {
  const { id } = request.params;
  const { password, resetCode } = request.body;

  const users = await readFile(USERS_FILE_PATH);

  const user = users.find((user) => user.id === id);

  //writes new user password if reset codes math
  if (user) {
    if (resetCode === user.resetCode) {
      await writeFile(USERS_FILE_PATH, [
        ...users.filter((filterUser) => filterUser.id !== id),
        { ...user, password, resetCode: undefined },
      ]);

      response.status(200).json({ result: user });
    } else {
      response.status(409).json({ error: "Invalid password reset code" });
    }
  } else {
    response.status(404).json({ error: "user not found" });
  }
});

//finds user and writes them a reset code to be used when changing password
app.post("/api/account_recovery", async (request, response) => {
  const { email } = request.body;

  const users = await readFile(USERS_FILE_PATH);

  const lowercaseEmail = email.toLowerCase();

  const user = users.find((user) => user.email === lowercaseEmail);

  if (user) {
    try {
      const resetCode = uuid().substr(0, 5);

      await writeFile(USERS_FILE_PATH, [
        ...users.filter(({ id }) => id !== user.id),
        { ...user, resetCode },
      ]);

      console.log("resetCode", resetCode);
      response.status(200).json({ result: true });
    } catch (error) {
      response.status(400).json({ error });
    }
  } else {
    response.status(404).json({ error: "user not found" });
  }
});

app.post("/api/account_recovery_code", async (request, response) => {
  const { email, resetCode } = request.body;

  const users = await readFile(USERS_FILE_PATH);

  const lowercaseEmail = email.toLowerCase();

  const user = users.find((user) => user.email === lowercaseEmail);

  if (user) {
    if (resetCode === user.resetCode) {
      response.status(200).json({ result: user });
    } else {
      response.status(409).json({ error: "Invalid password reset code" });
    }
  } else {
    response.status(404).json({ error: "user not found" });
  }
});

// start the app and listen on port ${PORT}.
const server = app.listen(PORT, () => {
  console.log(`--------------------------------------------`);
  console.log(`| Server started at http://localhost:${PORT}. |`);
  console.log(`--------------------------------------------\n`);
  console.log(`Waiting for requests...`);
});
