import { ApolloClient } from '@apollo/client'
import { TaskStatus } from 'src/components/TasksControlPanel/TasksControlPanel'
import { Task, User } from 'types/graphql'
import {
  ARCHIVE_TASKS_MUTATION,
  ASSIGN_TASK_MUTATION,
  CHANGE_TASK_STATUS_MUTATION,
  CREATE_TASK_MUTATION,
  DELETE_ALL_TASKS_MUTATION,
  DELETE_TASK_MUTATION,
  UNASSIGN_TASK_BY_USER_MUTATION,
  UNASSIGN_TASK_MUTATION,
  UPDATE_TASK_POSITIONS_MUTATION,
} from './mutation'
import {
  GET_ALL_TASKS_BY_STATUS_QUERY,
  GET_ALL_USERS,
  GET_ASSIGNED_USERS_BY_TASK_QUERY,
  GET_USER_TASKS_BY_STATUS_QUERY,
} from './query'

export const getAllUsers = async (
  client: ApolloClient<object>
): Promise<User[]> => {
  const queryResults = await client.query({
    query: GET_ALL_USERS,
    fetchPolicy: 'network-only',
  })

  return queryResults.data.users
}

export const getUserTasksByStatus = async (
  userId: number,
  status: TaskStatus,
  client: ApolloClient<object>
): Promise<Task[]> => {
  const queryResults = await client.query({
    query: GET_USER_TASKS_BY_STATUS_QUERY,
    variables: {
      userId,
      status,
    },
    fetchPolicy: 'network-only',
  })

  return queryResults.data.getUserTasksByStatus
}

export const getAllTasksByStatus = async (
  status: TaskStatus,
  client: ApolloClient<object>
): Promise<Task[]> => {
  const queryResults = await client.query({
    query: GET_ALL_TASKS_BY_STATUS_QUERY,
    variables: {
      status,
    },
    fetchPolicy: 'network-only',
  })

  return queryResults.data.getAllTasksByStatus
}

export const getAssignedUsersByTask = async (
  taskId: number,
  client: ApolloClient<object>
): Promise<User[]> => {
  const queryResults = await client.query({
    query: GET_ASSIGNED_USERS_BY_TASK_QUERY,
    variables: {
      taskId,
    },
    fetchPolicy: 'network-only',
  })

  return queryResults.data.getAssignedUsersByTask
}

export const createTask = async (
  userId: number,
  title: string,
  description: string,
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: CREATE_TASK_MUTATION,
    variables: {
      userId,
      input: {
        title,
        description,
      },
    },
  })

  return mutationResults.data.createTask
}

export const deleteAllTasks = async (
  client: ApolloClient<object>
): Promise<boolean> => {
  await client.mutate({
    mutation: DELETE_ALL_TASKS_MUTATION,
  })

  return true
}

export const updateTaskPositions = async (
  input: { id: number; position: number }[],
  client: ApolloClient<object>
): Promise<boolean> => {
  await client.mutate({
    mutation: UPDATE_TASK_POSITIONS_MUTATION,
    variables: {
      input,
    },
  })

  return true
}

export const assignTask = async (
  userIds: number[],
  taskId: number,
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: ASSIGN_TASK_MUTATION,
    variables: {
      userIds,
      taskId,
    },
  })

  return mutationResults.data.assignTask
}

export const changeTaskStatus = async (
  userId: number,
  taskId: number,
  status: TaskStatus,
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: CHANGE_TASK_STATUS_MUTATION,
    variables: {
      userId,
      taskId,
      status,
    },
  })

  return mutationResults.data.changeTaskStatus
}

export const unassignTask = async (
  taskId: number,
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: UNASSIGN_TASK_MUTATION,
    variables: {
      taskId,
    },
  })

  return mutationResults.data.unassignTask
}

export const unassignTaskByUser = async (
  taskId: number,
  userId: number,
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: UNASSIGN_TASK_BY_USER_MUTATION,
    variables: {
      taskId,
      userId,
    },
  })

  return mutationResults.data.unassignTaskByUser
}

export const archiveTasks = async (
  taskIds: number[],
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: ARCHIVE_TASKS_MUTATION,
    variables: {
      taskIds,
    },
  })

  return mutationResults.data.archiveTasks
}

export const deleteTask = async (
  userId: number[],
  taskId: number,
  client: ApolloClient<object>
): Promise<Task> => {
  const mutationResults = await client.mutate({
    mutation: DELETE_TASK_MUTATION,
    variables: {
      userId,
      taskId,
    },
  })

  return mutationResults.data.deleteTask
}
