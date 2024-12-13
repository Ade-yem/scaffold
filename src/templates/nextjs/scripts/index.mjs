/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import { exec, execSync } from "child_process";

/**
 * 
 * @param {string} name name of file to be created
 * @param {"component" | "page" | "context" | "ui"} type type of file to be created
 * @returns content of the file
 */
export function createContent(name, type) {
  const convertName = name.charAt(0).toLocaleUpperCase() + name.slice(1);
  const pageContent = `
  "use client";
  
  export default function ${convertName} () {
    return (
      <div className="text-center">
        <h1 className="font-bold text-xl">Welcome to ${convertName} page</h1>
      </div>
    )
  }
  `
  const componentContent = `
  import React from "react";

  export const ${convertName}:React.FC = () => {
    return (
      <div>A react component</div>
    )
  }
  `
  const contextContent = `
  "use client";

  import { ReactNode, createContext, useContext, useEffect, useState } from "react";
  
  const ${convertName}Context = createContext<any | null>(null);
  
  export const use${convertName} = () => {
    return useContext(${convertName}Context);
  };

  export const ${convertName}Provider = ({ children }: { children: ReactNode }) => {
    return <${convertName}Context.Provider value={{  }}>{children}</${convertName}Context.Provider>;
  }
  `
  return type === "page" ? pageContent : type === "component" || type === "ui" ? componentContent : contextContent
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
    console.log("Creating sole file...")
    makePage(path.join(pageDir, nameOfPage), nameOfPage, type);
  }
}

/**
 * Creates a directory
 * @param {string} dirPath - path to the dorectory
 */
function makeDir(dirPath) {
  console.log(chalk.blue(`Creating directory ${dirPath} `));
  fs.mkdirSync(dirPath);
}

function checkPath (filePath, pageDir) {
  const pagePath = path.join(pageDir, filePath);
  if (fs.existsSync(pagePath)) throw new Error(`Page ${pagePath} already exist`);
}

function makePage (filePath, pageName, type) {
  if (type !== "component") {
    fs.writeFileSync(`${filePath}.tsx`, createContent(pageName, type), "utf-8");
    const editor = checkEditor();
    openFile(editor, `${filePath}.tsx`);
  } else {
    const writePath = path.join(filePath, type === "page" ? "page.tsx" : "index.tsx");
    fs.mkdirSync(filePath);
    fs.writeFileSync(writePath, createContent(pageName, type), "utf-8");
    const editor = checkEditor();
    openFile(editor, writePath);
  }
}

function checkInternalDirs (filePath) {
  if (fs.existsSync(filePath)) return true;
  return false;
}

function openFile(editor, filePath) {
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
  })
}

const checkEditor = () => {
  try {
    execSync("code --version", {stdio: "ignore"});
    return "code";
  } catch (error) {
    console.log(chalk.blue(error.message));
  }
  try {
    execSync("vim --version", {stdio: "ignore"});
    return "vim";
  } catch (error) {
    console.log(chalk.blue(error.message));
  }
  return "";
}