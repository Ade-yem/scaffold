/* eslint-disable @typescript-eslint/no-explicit-any */
import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../constant.mjs";
import { createPage } from "./index.mjs";

const componentDir = path.join(ROOT_DIR, "src", "components");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfComponent",
    message: "What is the name of the component?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfComponent, componentDir, "component");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})



