import { ApolloClient } from '@apollo/client'
import { MutationupdateTaskPositionsArgs } from 'types/graphql'
import {
  CREATE_TASK_MUTATION,
  DELETE_ALL_TASKS_MUTATION,
  UPDATE_TASK_POSITIONS_MUTATION,
} from './mutation'
import { GET_ALL_USERS, GET_TASKS_CREATED_BY_USER_QUERY } from './query'

export const getAllUsers = async (client: ApolloClient<object>) => {
  const queryResults = await client.query({
    query: GET_ALL_USERS,
    fetchPolicy: 'network-only',
  })

  return queryResults.data.users
}

export const getTasksCreatedByUser = async (
  userId: number,
  client: ApolloClient<object>
) => {
  const queryResults = await client.query({
    query: GET_TASKS_CREATED_BY_USER_QUERY,
    variables: {
      userId,
    },
    fetchPolicy: 'network-only',
  })

  return queryResults.data.getTasksCreatedByUser
}

export const createTask = async (
  userId: number,
  title: string,
  description: string,
  client: ApolloClient<object>
) => {
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

export const deleteAllTasks = async (client: ApolloClient<object>) => {
  await client.mutate({
    mutation: DELETE_ALL_TASKS_MUTATION,
  })

  return true
}

export const updateTaskPositions = async (
  input: { id: number; position: number }[],
  client: ApolloClient<object>
) => {
  await client.mutate({
    mutation: UPDATE_TASK_POSITIONS_MUTATION,
    variables: {
      input,
    },
  })

  return true
}
