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

> Important Note: There is a unique problem I faced, related to Redwoodjs setup that I haven't been able to fix so far. The Log out functionality  is not working on the backend. It works on the frontend but when the page is refreshed, the backend does not execute a log out handler and it  ends up returning the last currentUser and isAuthenticated to true. I could not find on the web (Redwoodjs Docs, blogs, forums) how to activate the logout feature on the server using the Redwood Self-hosted Auth.
However, on the frontend we can log out and log in with as many users as we want.

## How to use the Application

### Basic Terminology

- Task Creator: A registered User that created the Task.
- Task Assignee: A registered User to whom the Task has been assigned.


### Access to the App and Log in / Sign up

When you open the App, you will be directed to the hompage. Then you can click on the Log in button (if you already have a user in the App), or the Sign up button, to create a new user. You can't work with Tasks without creating a user before.

### Entering the Task Page

Once you have logged in / signed up to the App, you'll be redirected to the Task Page. You will see on the page header your username and a Log out button to exit the Application. On the left side there's a side bar with a bunch of controls. Let's dive into the first and most important action: Creating a Task.

### Creating a Task

All users can create tasks. You just need to follow this steps:

- Click on the NEW TASK button. The New Task Modal will open.
- Enter the Title and Description of the Task.
- Click on the Confirm Button.

You will see a new Task created at the end of the TO DO List.

> Future improvement: When the User creates a new Task, we would like to see the new task at the top of the list.

Let's give a brief description of the data displayed on the new Task:

- Title: At the top of the Task, in blue color and capital letters.
- Created at: Date of creation.
- Created by: The User who created the Task. If the task was created by the logged user it will say "ME".
- Assigned to: The Assignee users of the Task. The possible values are the following:
  - ME : The user logged in.
  - ME and (n) User(s).
  - (n) User(s).
- Description: There's a small eye icon where you can hover and a Tooltip will be displayed with the text description of the Task.

> Future improvement: The description could be displayed on its own Modal to make the reading easier, and could be in HTML format.

There's a group of buttons displayed on the right side of every task. The actions are described below:

- Delete Task: Allows the creator to delete a Task (Only active for the Creator of the Task, in the TO DO list).
- Assign Me: This is a shortcut useful to assign the Task to the Creator. Only active for the Creator of the Task, in the TO DO list.
- Unassign Me: The opposite action of the Assign Me button. Only active for the Creator of the Task, in the TO DO and IN PROGRESS lists.
- Unassign All Users: The name is pretty descriptive. Only active for the Creator of the Task, in the TO TO list.
- Assign Users: This button allows you to add or remove assignee users for this Task. Only active for the Creator of the Task, in the TO DO and IN PROGRESS lists.

> Note: When you create a Task, you are the Creator, but you're not an assignee by default. This is because maybe you won't work on that Task, but you will assign it to other users. However, you can become an assignee, as will be explained later.





