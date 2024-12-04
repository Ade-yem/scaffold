/* eslint-disable @typescript-eslint/no-explicit-any */
import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../constant.mjs";
import { createPage } from "./index.mjs";

const contextDir = path.join(ROOT_DIR, "src", "components", "context");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfContext",
    message: "What is the name of the context?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfContext, contextDir, "context");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})



