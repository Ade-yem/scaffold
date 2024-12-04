import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../root.mjs";
import { createPage } from "./index.mjs";

const modelDir = path.join(ROOT_DIR, "src", "models");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfmodel",
    message: "What is the name of the model?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfmodel, modelDir, "model");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})
