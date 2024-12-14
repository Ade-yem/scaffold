# mern-menn
This is a scaffold generator for a fill stack nodejs project which follows the appropriate mvc architecture. It consists of technologies such as 
- react
- next.js
- express
- sequelize
- mongoose
- resend
- mongodb
- mysql

It consists of a frontend and a baackend and you can choose the stack you want to use for your project.

## Features

- The scaffold provides full authentication using cookies and gives you wide options of database to use from mongodb to sql databases.
- Provides a set of cli tools to make creation of files such as pages, sercvice and components files easier.
- It attempts to open files after creation using vs code if it is installed or vim. 

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn or npm

### Installation
1. Install the package
  ```sh
    yarn global add mern-menn
  ```
  OR
  ```sh
    npm install mern-menn -g
  ```
2. run `mern-menn` - This will ask your type of frontend and name of the project to generate the scaffold and install the dependencies for you.

### CLI tools

This project includes several scripts to help with development and management of the project. Below is an explanation of each script:

#### Backend

- **`yarn create:controller`**: This command creates a new controller in the server workspace.
    ```sh
    yarn create:controller
    ```

- **`yarn create:route`**: This command creates a new route in the server workspace.
    ```sh
    yarn create:route
    ```

- **`yarn create:model`**: This command creates a new model in the server workspace.
    ```sh
    yarn create:model
    ```

- **`yarn create:service`**: This command creates a new service in the server workspace.
    ```sh
    yarn create:service
    ```

- **`yarn start`**: This command starts the server workspace.
    ```sh
    yarn start
    ```

#### Frontend

- **`yarn create:page`**: This command creates a new page in the frontend workspace.
    ```sh
    yarn create:page
    ```

- **`yarn create:ui`**: This command creates a new UI component in the frontend workspace.
    ```sh
    yarn create:ui
    ```

- **`yarn create:context`**: This command creates a new context in the frontend workspace.
    ```sh
    yarn create:context
    ```

- **`yarn dev`**: This command starts the development server for the frontend workspace.
    ```sh
    yarn dev
    ```

- **`yarn build`**: This command builds the frontend workspace for production.
    ```sh
    yarn build
    ```

- **`yarn client:start`**: This command starts the frontend workspace in production mode.
    ```sh
    yarn client:start
    ```

- **`yarn lint`**: This command runs the linter for the frontend workspace.
    ```sh
    yarn lint
    ```

#### Usage

To run any of these scripts, use the following command format:
```sh
yarn <command>
```
For example, to create a new controller in the server workspace, you would run:

```sh
yarn create:controller
```

#### Configuring server
Edit the `server.config.ts` to configure the type of database you would like to use and the dialect for your sql database if you choose sql.

**NB:** The `server.config.ts` controls what kind of model will be created.

## Future updates
Future updates includes
- More methods of authentication including face, fingerprint authentications, more social auths.
- More authorization methods for the backend like authorization headers and more.
- More advanced cli scripts to make files managment much more easier.
- Scaffolds for Web3 projects.

## Keywords
react, next.js, express, sequelize, mongoose, resend, mongodb, mysql