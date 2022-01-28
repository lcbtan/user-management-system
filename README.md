
# User Management System
## ❯ Initial
This application was built using the wonderful w3tecch's [express-typescript-boilerplate](https://github.com/w3tecch/express-typescript-boilerplate). Do check the repository out for more details on the framework.

## ❯ Brief Description
This is a simple backend application serving endpoints for managing users with authentication capabilities and integrated swagger documentation.

![divider](./w3tec-divider.png)

## ❯ Getting Started

This is the instructions to start the app without using docker. **Using docker is more recommended** for easier deployment. Please proceed to the Docker section below to check with the dockerized solution.

### Step 1: Requirements

You need to set up your development environment before you can do anything.

- Install [Node.js and NPM](https://nodejs.org/en/download/)
- Install yarn globally
- Install a MySQL database.

### Step 2: Create new Project

1. Copy the `.env.example` file and rename it to `.env`. In this file you have to add your database connection information. Configure the `.env` file according to your preferred setup

2. Create a new database with the name you have in your `.env`-file.

3. Then setup your application environment.

```bash
yarn run setup
```

> This installs all dependencies with yarn. After that it migrates the database and seeds some test data into it. So after that your development environment is ready to use.

### Step 3: Serve your App

Go to the project dir and start your app with this yarn script.

```bash
yarn start serve
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the server according to these changes.
> The server address will be displayed to you as `http://0.0.0.0:3000`.

![divider](./w3tec-divider.png)

## ❯ API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route          | Description |
| -------------- | ----------- |
| **/api**       | Shows us the name, description and the version of the package.json |
| **/swagger**   | This is the Swagger UI with our API documentation |
| **/api/users** | Users endpoint |
| **/api/login** | Login endpoint |
| **/api/logout**| Logout endpoint |


## ❯ Docker (Recommended)

### Install Docker

Before you start, make sure you have a recent version of [Docker](https://docs.docker.com/engine/installation/) installed

### Docker compose

You can run the app with a dockerized container with a dockerized database using docker-compose. No need to install and setup mysql.

Run docker-compose and then you're done.
```shell
docker-compose up
```
Once finished, don't forget to remove the images.
```shell
docker-compose down
```

## ❯ Documentation / Swagger

In swagger, you can look for the available APIs as well as their descriptions, parameters, body payload, and response payload types/structure for your reference.

This would also include information on the needed format and validation when passing these data such as length and type of the data passed.

### **Note**: The credential for authentication of swagger is the one stated in the `.env` file `SWAGGER_USERNAME` and `SWAGGER_PASSWORD`.


## ❯ Testing the APIs

You can use swagger to test the APIs out. Please click the **Test it out** button per api to execute a curl command with the given corresponding payload, query, and/or parameter.

### **Note**: Please login with an **admin** role first before trying out any api since the server checks for authorization. You can login with `username="admin"` and `password="admin"` credentials

## ❯ License

[MIT](/LICENSE)
