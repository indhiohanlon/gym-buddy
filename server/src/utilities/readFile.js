import { promises as fs } from "fs";
import { DATA_DIRECTORY } from "../constants/index.js";

//creating an asycronous function that reads a file given a file path
const readFile = async (entityFileName) => {
  try {
    const data = await fs.readFile(`${DATA_DIRECTORY}/${entityFileName}`);

    return JSON.parse(data.toString("utf8"));
  } catch (error) {
    console.log(error);
  }

  return [];
};

//exporting to be used elsewhere
export default readFile;
