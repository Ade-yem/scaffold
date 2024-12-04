import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { ROOT_DIR } from "../constant.mjs";

const pageDir = path.join(ROOT_DIR, "src", "app");

inquirer.prompt([
  {
    type: "input",
    name: "nameOfFile",
    message: "What is the name of the page? You can also input path"
  },
]).then(async (answer) => {
  try {
    await createPage(answer.nameOfFile);
  } catch (error) {
    console.log(chalk.red(error.message));
    return;
  }
})

/**
 * create the template content for a file
 * @param {string} name name of file
 * @returns the template string for the file
 */
function createContent(name) {
  const convertName = name.charAt(0).toLocaleUpperCase() + name.slice(1);
  return  `
  "use client";
  
  export default function ${convertName} () {
    return (
      <div className="text-center">
        <h1 className="font-bold text-xl">Welcome to ${convertName} page</h1>
      </div>
    )
  }
  `
}

/**
 * create the template content for a file
 * @param {string} nameOfPage name of file
 * @returns the template string for the file
 */
async function createPage(nameOfPage) {
  checkPath(nameOfPage);
  if (nameOfPage.includes("/") || nameOfPage.includes("\\")) {
    const pageArray = nameOfPage.split(/[/\\]/);
    try {
      let currentDir = "";
      for (let i = 0; i < pageArray.length; i++) {
        currentDir = i === 0 ? path.join(pageDir, pageArray[i]) : path.join(currentDir, pageArray[i])
        if (checkInternalDirs(currentDir)) continue;
        makePage(currentDir, pageArray[i]);
      }
    } catch (error) {
      throw new Error(error.message)
    }
  } else {
    makePage(path.join(pageDir, nameOfPage), nameOfPage);
  }
}

/**
 * checks if a file exist
 * @param {string} filePath path to a fikle
 */
function checkPath (filePath) {
  const pagePath = path.join(pageDir, filePath);
  if (fs.existsSync(pagePath)) throw new Error(`Page ${pagePath} already exist`);
}

/**
 * Createa a page and add template content to it
 * @param {string} filePath path to a file
 * @param {string} pageName name of the file
 */
function makePage (filePath, pageName) {
  const writePath = path.join(filePath, "page.tsx");
  fs.mkdirSync(filePath);
  fs.writeFileSync(writePath, createContent(pageName), "utf-8")
}

function checkInternalDirs (filePath) {
  if (fs.existsSync(filePath)) return true;
  return false;
}