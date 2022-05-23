# Code Test

## Prerequisites

Make sure you have Node.js and PostgreSQL installed locally before continuing.

## Initial setup

1. Clone this repo
1. Run `nvm use`
1. Run `yarn install`
1. Create `.env` file
1. Run `yarn secret` and copy the value to the `SESSION_SECRET` variable in `.env`
1. Run `yarn migrate`
1. Run `yarn dev`

## Instructions

- Create a new model that represents a `Task` in a todo list application.
-	Write the queries and mutations to list and create a new task.
- Create an additional 1-to-many model which assigns a single task to at least 2 users
- Write the queries and mutations which complete the task as another user
- Implement UI changes to support the new functionality

# Redwood

> **NOTICE:** RedwoodJS is very close to a stable version 1.0. In the last two years,
> the project has matured significantly and is already used in production by a number
> of startups. We intend to have a 1.0 release candidate before the end of 2021 and
> to release a truly production-ready 1.0 in early 2022.

## Getting Started
- [Tutorial](https://redwoodjs.com/tutorial/welcome-to-redwood): getting started and complete overview guide.
- [Docs](https://redwoodjs.com/docs/introduction): using the Redwood Router, handling assets and files, list of command-line tools, and more.
- [Redwood Community](https://community.redwoodjs.com): get help, share tips and tricks, and collaborate on everything about RedwoodJS.

### Setup

We use Yarn as our package manager. To get the dependencies installed, just do this in the root directory:

```terminal
yarn install
```

### Fire it up

```terminal
yarn redwood dev
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.
