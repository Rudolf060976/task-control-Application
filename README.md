# Code Test

## Prerequisites

Make sure you have Node.js installed locally before continuing.

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
- Create an additional model which provides a relationship between a task and at least 2 users
- Write the queries and mutations which allow a user to complete a task
- The system should keep track of who created a task separately from who completed it
- Implement UI changes to support the new functionality

# Redwood

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

# Delivery of the Project

> Important Note: There is a unique problem I faced and could not fixed, related to Redwoodjs setup that I haven't been able to fix so far. The Log out functionality  is not working on the backend. It works on the frontend but when the page is refreshed, the backend does not execute a log out handler and it  ends up returning the last currentUser and isAuthenticated to true. I could not find on the web (Redwoodjs Docs, blogs, forums) how to activate the logout feature on the server using the Redwood Self-hosted Auth.

## How to use the Application

### Basic Terminology

- Task Creator: A registered User that created the Task.
- Task Assignee: A registered User to whom the Task has been assigned.


### Access to the App and Log in / Sign up

When you open the App, you will be directed to the hompage. Then you can click on the Log in button (if you already have a user in the App), or the Sign up button, to create a new user. You can't work with Tasks without creating a user before.

### Entering the Task Page

Once you have logged in / signed up to the App, you'll be redirected to the Task Page. You will see on the page header your username and a Log out button to exit the Application.

