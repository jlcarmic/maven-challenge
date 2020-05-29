# Maven Challenge

## The Challenge
Write a program which delivers a working network server which handles traffic over HTTP and receives JSON input and output. The server will need to maintain simple state and you’ll need to make design decisions based on your understanding of the problem.

## Routes Available

### GET http://localhost:1337/

This route will return a full list of all numbers seen with the number of times they have been seen.

#### Expected Response
```JSON
[
  {
    "number": 1,
    "times": 4,
  },
  {
    "number": 2,
    "times": 1
  }
]
```

### POST http://localhost:1337/

This route accepts a number. If the number has not been seen it is added to the list of numbers. If the number has previously been seen, its times attribute is incremented by 1.

#### Expected Headers
Content-Type: application/json

#### Expected Body
```JSON
{
  "number": 1
}
```

#### Expected Response
```JSON
{
  "number": 1,
  "times": 1
}
```

### PUT http://localhost:1337/

This route expects a number and an increment_value greater than 1. If the number has been previously seen, the times attribute of that number will be incremented by the increment_value provided.

#### Expected Headers
Content-Type: application/json

#### Expected Body
```JSON
{
  "number": 1,
  "increment_value": 3
}
```

#### Expected Response
```JSON
{
  "number": 1,
  "times": 4
}
```

## Installation and Execution
A Dockerfile has been provided to allow this project to be spun up in a container. You can also run it locally using the Node instance on your machine.

### Docker
To run this project with Docker use the commands below to build the container and then run it.

```CLI
> docker build -t maven-challenge .
> docker run --name maven-challenge -p 1337:1337 maven-challenge
```

### Locally with Node 12.16.2
This project was built against Node v12.16.2. If you have this (or a compatible version) installed on your machine you can spin this project up locally with the commands listed below. If you want to install this Node version it can be found [here](https://nodejs.org/dist/v0.12.16/).

```CLI
> npm install
> npm run dev
```

## Locally with Node Version Manager
If you have Node Version Manager (NVM) installed you can quickly install v12.16.2 to ensure you have that version available and then use that version via the provided `.nvm` file. To install NVM see [documentation](https://github.com/nvm-sh/nvm).

```CLI
> nvm install 12.16.2
> nvm use
```

## Linter and Tests
This project has ESLint setup for enforcement of coding standards as well as a test suite built with Mocha. To run either of these use the commands listed below.

### ESLint

```CLI
> docker run -e CI=true maven-challenge npm run lint
```

### Tests

```CLI
> docker run -e CI=true maven-challenge npm run test
```
