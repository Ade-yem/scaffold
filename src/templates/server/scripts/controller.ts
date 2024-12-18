import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../root";
import { createPage } from "./index";

const controllerDir = path.join(ROOT_DIR, "src", "controllers");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfController",
    message: "What is the name of the controller?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfController, controllerDir, "controller");
  } catch (error) {
    console.log(chalk.red((error as Error).message));
    return;
  }
})



