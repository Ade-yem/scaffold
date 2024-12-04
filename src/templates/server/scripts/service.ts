import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../root.mjs";
import { createPage } from "./index.mjs";

const serviceDir = path.join(ROOT_DIR, "src", "service");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfservice",
    message: "What is the name of the service?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfservice, serviceDir, "service");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})



