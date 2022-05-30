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


### Assigning Tasks to Users.

#### Assigning a Task to the Creator.

If you created the Task, you can become an assignee in several possible ways:
- If the Task is on the TO DO List and has no assignees, you can just drag the Task to the IN PROGRESS List and then you'll be an assignee immediately.
- If the Task is on the TO DO List and has assignees, you can click on the Assign Me button and you'll be an assignee immediately.
- If the Task is on the IN PROGRESS List, you can click on the Assign Me button and you'll be an assignee immediately.
- If the Task is on the TO DO List or IN PROGRESS List, you can click on the Assign Users button to open a Modal and assign the Task to your own User.


> Note: Only the Creator of a Task is able to assign the Task to themselve or to other Users.


> Note: You can't assign/unassign Tasks to Users in the DONE List.


#### Assigning a Task to other Users.

If you created the Task, you can assign the Task to other users following the steps bellow:

- Click on the Assign Users button. The Assign Task to Users Modal will open.
- If the Task has already any Assignees, you will see them listed at the bottom of the Modal.
- Type the username in the Search Input to search for users, and select the desired user, using the arrow keys (up and down) or clicking with the Mouse.
- The user will be added to the bottom list.
- Repeat the process to add more users.
- You can also remove users from the list, clicking on the delete icon (-).
- Once you have all the desired users on the list, click on Confirm.

> Note: You can Add as many users as you want, but you can't leave the list empty. If you need to remove all assigned users, there's a button for that, as described below.

> Note: Please remember that only de Creator of the Task can assign/unassign the Task to other users. You can't assign/unassign Tasks to Users in the DONE List. Furthermore, You can't assign/unassign Tasks to Users in the DONE List.


### Unassigning Tasks.

#### Removing the Creator as assignee.

If you created the Task and you are already an asignee (you will se "ME" in the Assigned to field), you can remove that relation in one of three possible ways:

- If the Task is on the TO DO List, click on the Unassign Me button (red color) and you will no longer see the "ME" word in the Assigned to field.
- If the Task is on the IN PROGRESS List and besides you, there are other assignees in the Task, click on the Unassign Me button (red color) and you will no longer see the "ME" word in the Assigned to field.

> Note: If the Task is on the IN PROGRESS List and you, the Creator of the Task, are the only assignee, unfortunately you won't be able to remove the relationship on the IN PROGRESS List. You need to Drag the Task to the TO DO List before you can click on the Unassign button. This is because it makes no sense to leave a Task on the IN PROGRESS List without Assignees.

- If the Task is on the TO DO List, click on the Unassign All Users button (red color) to remove all assignees from the Task (including you).

> If the Task is on the IN PROGRESS List, the Unassign All Users button is not active. This is because it makes no sense to leave a Task on the IN PROGRESS List without Assignees.

### Getting the list of Assignees of a Tasks.

You can see the list of Assignees (users) of a Task in one of two ways:

- All users (creator and no-creator) will be able to hover on the Assigned to field of the Task and a Tooltip will be displayed listing the assignees.
- If you are the Creator of the Task, and the Task is on the TO DO List or IN PROGRESS List, you can click on the Assign Users button and you'll see the list of assignees at the bottom of the Assign Task to Users Modal.

### Deleting Tasks.

Only the Creator of the Task is able to delete the Task. If the Task is on the TODO List, click on the Delete Task button and the Task will be gone.

> The Creator can only delete Tasks on the TODO List.


### The Task Filter (Tasks to Show Toggle Button).

It's located in the left sidebar and can only have two possible values:

- MINE: When you click on this Button, all the lists (TO DO, IN PROGRESS AND DONE) will show only those Tasks you Created and also the Tasks that were assigned to your user.
- ALL: Here you can see all Tasks (Created or not created, assigned or not assigned to you).


### Dragging Tasks.

You can move (drag) Tasks accross the three lists (TO DO, IN PROGRESS AND DONE) but you are limited by the following rules:

- You can only move those Tasks create by you or assigned to you. When you click on the All button of the Task Filter you will see Tasks created by and assign to other users, but you won't be able to Drag them.

> You can easily recognize the Tasks you can't drag because they will have a light gray background color.

- You can't move a Task directly from TO DO to DONE or vice versa.

> Future Improvement: There are use cases where it would be useful if the Creator could block a Task to prevent other users from dragging it.


### Task counters in the Lists.

At the top right of each list there's a counter that allows the user to know the count of tasks on that list.


### Completing Tasks.

The following users can complete a Task, dragging the Task from the IN PROGRESS List to the DONE List:

- The Creator of the Task, regardless of whether it is an assignee or not.
- Any of the assignees of the Task.

When any of the previous mentioned users drag the Task to the DONE List, the Task status will be changed to 'done' and a label displaying the name of the user that moved the Task will be shown at the bottom of the Task.

> Any of the assignees of the Task (and even the Creator) can drag the Task to the DONE list, but the Task will be marked as "Completed by" the user who moved it.

If any of the mentioned users drag the Task back to IN PROGRESS, the Task status will be switched back to 'inprogress' and the 'Completed by' field will be gone.


### Archiving Tasks.

This feature allows the user to 'clean' the DONE List, getting rid of completed tasks that are no longer needed. However, archiving tasks is limited by the following rule:

- Only the creator of the Tasks can archive these Tasks on the DONE List. Those Tasks where the User is asignee (but not creator) can't be archived by them. Those Tasks can be archived by their creators.

A Modal will open asking to confirm the action.


### Other future improvements.

- Creator and assignee users will be able to add comments to a Task.
- Additional filters: Filter Tasks by user, by Period, etc.
- New page to open a List and see more tasks at the same time, and being able to move tasks without dragging them.
- PDF Reports of completed Tasks by period and by user.

### More ideas coming up...Really enjoyed this project...Thanks for that :+1:
