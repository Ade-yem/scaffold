/* eslint-disable @typescript-eslint/no-explicit-any */
import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../constant.mjs";
import { createPage } from "./index.mjs";

const UIDir = path.join(ROOT_DIR, "src", "components", "ui");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfUI",
    message: "What is the name of the ui?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfUI, UIDir, "ui");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})



