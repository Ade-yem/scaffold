import inquirer from "inquirer";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../root.mjs";
import { createPage } from "./index.mjs";

const routeDir = path.join(ROOT_DIR, "src", "route");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfroute",
    message: "What is the name of the route?"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfroute, routeDir, "route");
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})


