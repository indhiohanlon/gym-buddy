import { promises as fs } from "fs";
import { DATA_DIRECTORY } from "../constants/index.js";

// create an asyncronous function that will write the entity data to the entityFileName file.
const writeFile = async (entityFileName, entity) => {
  // convert the enitity to a json formatted string.
  const fileContents = JSON.stringify(entity);

  try {
    // write the fileContents to the file at ${DATA_DIRECTORY}/${entityFileName}.
    // once it's been written, set the value of result to whether it succeeded or failed.
    const result = await fs.writeFile(
      `${DATA_DIRECTORY}/${entityFileName}`,
      fileContents
    );
  } catch (error) {
    console.log(error);
  }
};

export default writeFile;
