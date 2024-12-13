import * as path from "path";
import * as fs from "fs";
import serverConfig from "../server.config";
import chalk from "chalk";
import { exec, execSync } from "child_process";

/**
 * convert type of document to first character capital letter
 * @param {"controller" | "model" | "route" |"service"} type type of file
 * @returns string
 */
function convertType(type: "controller" | "model" | "route" | "service") {
  const convertName = type.charAt(0).toLocaleUpperCase() + type.slice(1);
  return type === "route" ? `${convertName}r` : convertName;
}

/**
 *
 * @param {string} name name of the file
 * @param {"controller" | "model" | "route" |"service"} type type of file
 * @returns
 */
export function createContent(
  name: string,
  type: "controller" | "model" | "route" | "service",
) {
  const convertName = name.charAt(0).toLocaleUpperCase() + name.slice(1);
  const route = `
  import { Router } from "express";

  const ${name}Router = Router();
  export default ${name}Router;
  `;
  const controller = `
  export default class ${convertName}Controller {
  
  }
  `;
  const model =
    serverConfig.database === "mongodb"
      ? `
  import mongoose from "mongoose";

  const ${name}Schema = new mongoose.Schema{
  
  }
  export const ${convertName} = mongoose.model("${name}s", ${name}Schema);
  module.exports = ${convertName};
  `
      : `
  import {DataTypes, UUIDV4} from "sequelize";
  import { sequelize } from ".";

  export const ${convertName} = sequelize.define(
    "${convertName}",
    {

    }

  );
  ${convertName}.sync();
  `;
  const service = `
    export const ${convertName}Service = async => {
      
    }
  `;
  return type === "route"
    ? route
    : type === "controller"
      ? controller
      : type === "model"
        ? model
        : service;
}

/**
 * Creates a file and add templates to it
 * @param {string} nameOfPage name of the page
 * @param {string} pageDir directory path of the file
 * @param {"controller" | "model" | "route" |"service"} type type of file
 */
export async function createPage(
  nameOfPage: string,
  pageDir: string,
  type: "controller" | "model" | "route" | "service",
) {
  checkPath(nameOfPage, pageDir, type);
  if (nameOfPage.includes("/") || nameOfPage.includes("\\")) {
    const pageArray = nameOfPage.split(/[/\\]/);
    console.log(pageArray);
    console.log("length -> ", pageArray.length);
    try {
      let currentDir = "";
      for (let i = 0; i < pageArray.length; i++) {
        currentDir =
          i === 0
            ? path.join(pageDir, pageArray[i])
            : path.join(currentDir, pageArray[i]);
        console.log(`check ${i} - currentDir - ${currentDir}`);
        if (checkInternalDirs(currentDir)) continue;
        if (i !== pageArray.length - 1) makeDir(currentDir);
        else makePage(currentDir, pageArray[i], type);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  } else {
    makePage(path.join(pageDir, nameOfPage), nameOfPage, type);
  }
}

/**
 * Checks if a file already exists
 * @param {string} filePath path of file
 * @param {string} pageDir base path
 * @param {"controller" | "model" | "route" |"service"} type type of file
 */
function checkPath(
  filePath: string,
  pageDir: string,
  type: "controller" | "model" | "route" | "service",
) {
  const pagePath = path.join(pageDir, `${filePath}${convertType(type)}.ts`);
  console.log(chalk.blue(`Checking whether the file exists...`));
  if (fs.existsSync(pagePath))
    throw new Error(`Page ${pagePath} already exist`);
}

/**
 * Adds template content to file
 * @param {string} filePath path of the file
 * @param {string} pageName name of file
 * @param {"controller" | "model" | "route" |"service"} type type of file
 */
function makePage(
  filePath: string,
  pageName: string,
  type: "controller" | "model" | "route" | "service",
) {
  console.log(chalk.blue("Creating the file and adding template content..."));
  fs.writeFileSync(
    `${filePath}${convertType(type)}.ts`,
    createContent(pageName, type),
    "utf-8",
  );
  const editor = checkEditor();
  openFile(editor, `${filePath}${convertType(type)}.ts`);
}

/**
 * Creates a directory
 * @param {string} dirPath - path to the dorectory
 */
function makeDir(dirPath: fs.PathLike) {
  console.log(chalk.blue(`Creating directory ${dirPath} `));
  fs.mkdirSync(dirPath);
}

function checkInternalDirs(filePath: fs.PathLike) {
  if (fs.existsSync(filePath)) return true;
  return false;
}

function openFile(editor: string, filePath: string) {
  const command = `${editor} ${filePath}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red(`Unable to open ${filePath} with ${editor}`));
      console.error("Error: ", error);
      return;
    }
    if (stderr) {
      console.error("Stderr error: ", stderr);
      return;
    }
    console.log(stdout);
  });
}

const checkEditor = () => {
  try {
    execSync("code --version", { stdio: "ignore" });
    return "code";
  } catch (error) {
    console.log(chalk.blue((error as Error).message));
  }
  try {
    execSync("vim --version", { stdio: "ignore" });
    return "vim";
  } catch (error) {
    console.log(chalk.blue((error as Error).message));
  }
  return "";
};