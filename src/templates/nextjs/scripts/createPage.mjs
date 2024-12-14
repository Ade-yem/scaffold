import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../constant.mjs";
import { createPage } from "./index.mjs";

const pageDir = path.join(ROOT_DIR, "src", "app");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfFile",
    message: "What is the name of the page? You can also input path"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfFile, pageDir, "page");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})
