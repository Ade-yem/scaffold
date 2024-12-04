import * as path from "path";
import * as fs from "fs";
import serverConfig from "../server.config.mjs";
import chalk from "chalk";

/**
 * convert type of document to first character capital letter
 * @param {"controller" | "model" | "route" |"service"} type type of file
 * @returns string
 */
function convertType(type) {
  const convertName = type.charAt(0).toLocaleUpperCase() + type.slice(1);
  return type === "route" ? `${convertName}r` : convertName;
}


/**
 * 
 * @param {string} name name of the file
 * @param {"controller" | "model" | "route" |"service"} type type of file
 * @returns 
 */
export function createContent(name, type) {
  const convertName = name.charAt(0).toLocaleUpperCase() + name.slice(1);
  const route = `
  import { Router } from "express";

  const ${name}Router = Router();
  export default ${name}Router;
  `
  const controller = `
  export default class ${convertName}Controller {
  
  }
  `
  const model = serverConfig.database === "mongodb" ? `
  import mongoose from "mongoose";

  const ${name}Schema = new mongoose.Schema{
  
  }
  export const ${convertName} = mongoose.model("${name}s", ${name}Schema);
  module.exports = ${convertName};
  ` :
    `
  import {DataTypes, UUIDV4} from "sequelize";
  import { sequelize } from ".";

  export const ${convertName} = sequelize.define(
    "${convertName}",
    {

    }

  );
  ${convertName}.sync();
  `
  const service = `
    export const ${convertName}Service = async => {
      
    }
  `
  return type === "route" ? route : type === "controller" ? controller : type === "model" ? model : service;
}

/**
 * Creates a file and add templates to it
 * @param {string} nameOfPage name of the page
 * @param {string} pageDir directory path of the file
 * @param {"controller" | "model" | "route" |"service"} type type of file
 */
export async function createPage(nameOfPage, pageDir, type) {
  checkPath(nameOfPage, pageDir, type);
  if (nameOfPage.includes("/") || nameOfPage.includes("\\")) {
    const pageArray = nameOfPage.split(/[/\\]/);
    console.log(pageArray);
    console.log("length -> ", pageArray.length);
    try {
      let currentDir = "";
      for (let i = 0; i < pageArray.length; i++) {
        currentDir = i === 0 ? path.join(pageDir, pageArray[i]) : path.join(currentDir, pageArray[i]);
        console.log(`check ${i} - currentDir - ${currentDir}`);
        if (checkInternalDirs(currentDir)) continue;
        if (i !== pageArray.length - 1) makeDir(currentDir);
        else makePage(currentDir, pageArray[i], type);
      }
    } catch (error) {
      throw new Error(error.message)
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
function checkPath(filePath, pageDir, type) {
  const pagePath = path.join(pageDir, `${filePath}${convertType(type)}.ts`);
  console.log(chalk.blue(`Checking whether the file exists...`));
  if (fs.existsSync(pagePath)) throw new Error(`Page ${pagePath} already exist`);
}

/**
 * Adds template content to file
 * @param {string} filePath path of the file
 * @param {string} pageName name of file
 * @param {"controller" | "model" | "route" |"service"} type type of file
 */
function makePage(filePath, pageName, type) {
  console.log(chalk.blue("Creating the file and adding template content..."));
  fs.writeFileSync(`${filePath}${convertType(type)}.ts`, createContent(pageName, type), "utf-8");
}

/**
 * Creates a directory
 * @param {string} dirPath - path to the dorectory
 */
function makeDir(dirPath) {
  console.log(chalk.blue(`Creating directory ${dirPath} `));
  fs.mkdirSync(dirPath);
}

function checkInternalDirs(filePath) {
  if (fs.existsSync(filePath)) return true;
  return false;
}