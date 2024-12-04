/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {exec} from "child_process";
import { fileURLToPath } from "url";
import { dirname } from 'path';
import * as ejs from "ejs";
import winston, { format, transports } from "winston";

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({timestamp, level, message}) => `${timestamp}, [${level}]: ${message}`),
  ),
  transports: [
    new transports.Console(),
    new transports.File({filename: "scaffold.log"}),
  ],
})

let projectType: "smart contract + frontend" | "frontend + backend" | "frontend + backend + smart contract" | undefined = undefined;
let frontend: "react" | "nextjs" | undefined = undefined;
let contract: "foundry" | "hardhat" | undefined = undefined;
const SKIP_FILES = ["node_modules", ".template.json"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const base = path.join(__dirname, "templates", "base");

const getFrontend = async () => {
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "frontendType",
      message: "What type of frontend do you want?",
      choices: [
        "react", "nextjs"
      ],
      default: "nextjs"
    }
  ]);
  frontend = res.frontendType;
}

/**
 * Prompts the user to select a contract environment from a list of choices.
 * 
 * @returns {Promise<void>} A promise that resolves once the user has made a selection.
 * 
 * @example
 * // Example usage:
 * await getContractEnvironment();
 * // User will be prompted to select either "hardhat" or "foundry".
 */
const getContractEnvironment = async () => {
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "contractType",
      message: "Which contract environment do you want?",
      choices: [
        "hardhat", "foundry"
      ],
      default: "foundry"
    }
  ]);
  contract = res.contractType;
}

const getName = async () => {
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the project?",
      default: "scaffold"
    },
  ]);
  return res.name;
}

const ask = async (projectPath: string) => {
  inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "There is an existing directory with the same name, do you want to overwrite it?",
    choices: ["yes", "no"],
  }]).then(async (answer) => {
    if (answer.choice === "yes") {
      fs.rmdirSync(projectPath, {recursive: true});
      fs.mkdirSync(projectPath);
    } else {
      console.log("Thank you for using our scaffold");
      process.exit(1);
    }
  })
}

/**
 * creates a directory
 * @param name name of the directory
 * @returns the full path of the created directory
 * @throws if the directory already exists
 */
const createFolder = async(name: string) => {
  const target = process.cwd();
  const projectPath = path.join(target, name);
  if (fs.existsSync(projectPath)) {
    await ask(projectPath);
  } else fs.mkdirSync(projectPath);
  return projectPath;
}

/**
 * adds files into folders
 * 
 * @param files files in a selected directory
 * @param target project directory
 * @param templatePath template directory
 */
const addFilesToFolder = async(files: string[], target: string, templatePath: string) => {
  try {
    files.forEach(async file => {
      const original = path.join(templatePath, file);
      const status = fs.statSync(original);
      if (SKIP_FILES.indexOf(file) > -1) return;
      if (status.isFile()) {
        let content = fs.readFileSync(original, "utf-8");
        content = ejs.render(content, {name: path.basename(target)});
        const writePath = path.join(target, file);
        logger.info("writing into " + writePath);
        fs.writeFileSync(writePath, content, "utf-8");
      } else if (status.isDirectory()) {
        logger.info("Creating new directory " + path.join(target, file));
        fs.mkdirSync(path.join(target, file));
        const newFiles = fs.readdirSync(original);
        await addFilesToFolder(newFiles, path.join(target, file), original);
      }
    })
  } 
  catch (error: any) {
    throw new Error(error.message);
  }
}

const createInternalFolders = async (directory: string, subDirectory: string) => {
  const res = path.join(directory, subDirectory);
  logger.warn("Creating internal folders " + res)
  fs.mkdirSync(res);
  logger.info("Successfully created internal folder");
  return res;
}


/* adds both frontend and smart contract code to the project
 *
 * @param contract choosen contract development environment
 */
const createFrontEndAndContract = async (projectPath: string, frontend: string, contract: string): Promise<string[]> => {
  const frontendPath = path.join(__dirname, "templates", frontend);
  const contractPath = path.join(__dirname, "templates", contract);
  const filesInFrontend = fs.readdirSync(frontendPath);
  const filesinContract = fs.readdirSync(contractPath);
  const front = await createInternalFolders(projectPath, frontend);
  const contr = await createInternalFolders(projectPath, contract);
  logger.info("Adding frontend files to frontend " + front)
  await addFilesToFolder(filesInFrontend, front, frontendPath);
  logger.info("Adding contract files to contract " + contr)
  await addFilesToFolder(filesinContract, contr, contractPath);
  return [front, contr];
}

/**
 * adds frontend and backend code 
 * @param projectPath path of the new project
 * @param frontend chosen frontend library
 */
const createFrontEndAndBackend = async (projectPath: string, frontend: string): Promise<string[]> => {
  const frontendPath = path.join(__dirname, "templates", frontend);
  const backendPath = path.join(__dirname, "templates", "server");
  const filesInFrontend = fs.readdirSync(frontendPath);
  const filesinBackend = fs.readdirSync(backendPath);
  const front = await createInternalFolders(projectPath, frontend);
  const back = await createInternalFolders(projectPath, "server");
  await addFilesToFolder(filesInFrontend, front, frontendPath);
  await addFilesToFolder(filesinBackend, back, backendPath);
  return [front, back];
}

/**
 * adds all options for the templates
 * @param projectPath path of the project
 * @param frontend chosen frontend library
 * @param contract choosen contract development environment
 */
const createAllThree = async (projectPath: string, frontend: string, contract: string): Promise<string[]> => {
  const frontendPath = path.join(__dirname, "templates", frontend);
  const contractPath = path.join(__dirname, "templates", contract);
  const backendPath = path.join(__dirname, "templates", "server");
  const filesInFrontend = fs.readdirSync(frontendPath);
  const filesinBackend = fs.readdirSync(backendPath);
  const filesinContract = fs.readdirSync(contractPath);
  const front = await createInternalFolders(projectPath, frontend);
  const back = await createInternalFolders(projectPath, "server");
  const contr = await createInternalFolders(projectPath, contract);
  await addFilesToFolder(filesInFrontend, front, frontendPath);
  await addFilesToFolder(filesinBackend, back, backendPath);
  await addFilesToFolder(filesinContract, contr, contractPath);
  return [front, back, contr];
}


/**
 * Creates a project structure based on the specified type.
 * 
 * @param {Object} params - The parameters for creating the project.
 * @param {string} params.projectPath - The path where the project will be created.
 * @param {"smart contract + frontend" | "frontend + backend" | "frontend + backend + smart contract" | undefined} params.type - The type of project to create.
 * @param {"react" | "nextjs" | undefined} params.frontend - The frontend framework to use.
 * @param {"foundry" | "hardhat" | undefined} params.contract - The smart contract framework to use.
 * 
 * @throws {Error} Throws an error if there is an issue during project creation.
 * 
 * @returns {Promise<void>} A promise that resolves when the project has been created.
 */
const create = async ({projectPath, type, frontend, contract }: {
  projectPath: string;
  type: "smart contract + frontend" | "frontend + backend" | "frontend + backend + smart contract" | undefined;
  frontend: "react" | "nextjs" | undefined;
  contract: "foundry" | "hardhat" | undefined;
}): Promise<void> => {
  try {
    const filesInBase = fs.readdirSync(base);
    await addFilesToFolder(filesInBase, projectPath, base);
    let templatePath = [];
    const packagePath = path.join(projectPath, "workspace");
    switch (type) {
      case "smart contract + frontend":
        templatePath = await createFrontEndAndContract(packagePath, frontend as string, contract as string);
        break;
      case "frontend + backend":
        templatePath = await createFrontEndAndBackend(packagePath, frontend as string);
        break
      default:
        templatePath = await createAllThree(packagePath, frontend as string, contract as string);
        break;
    }
    templatePath.forEach(async filePath => await finalProcessing(filePath));
  }
  catch (error: any) {
    throw new Error(error.message);
  }
};

const finalProcessing = async (finalPath: string) => {
  logger.info("Checking for package.json in " + finalPath);
  const exists = fs.existsSync(path.join(finalPath, "package.json"));
  if (exists) {
    logger.info("Package.json exists");
    process.chdir(finalPath);
    logger.info("Current working directory: " + process.cwd());
    exec("yarn install", (error, stdout, stderr) => {
      if (error) {
        throw new Error("Error installing dependencies");
      }
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
    });
    console.log(chalk.green("Dependencies installed successfully"));
  } else {
    throw new Error("failed creating the project");
    
  }
}

inquirer.prompt([
  {
    type: 'list',
    name: 'projectType',
    message: 'What type of project do you want to create?',
    choices: [
      // "smart contract + frontend",
      "frontend + backend",
      // "frontend + backend + smart contract",
    ],
  },
]).then(async (answers) => {
  projectType = answers.projectType;
  if (projectType === "smart contract + frontend") {
    await getFrontend();
    await getContractEnvironment();
  } else if (projectType === "frontend + backend") {
    await getFrontend();
  } else {
    await getFrontend();
    await getContractEnvironment();
  }
  const name = await getName();
  try {
    const projectPath = await createFolder(name);
    await create({projectPath, type: projectType, frontend, contract});
  } catch (error: any) {
    console.log(chalk.red(error.message));
    return;
  }
});