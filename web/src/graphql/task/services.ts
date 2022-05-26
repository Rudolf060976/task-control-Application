import { ApolloClient } from '@apollo/client'
import { CREATE_TASK_MUTATION } from './mutation'
import { GET_TASKS_CREATED_BY_USER_QUERY } from './query'

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
