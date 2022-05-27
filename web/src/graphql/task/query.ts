export const GET_ALL_TASKS_BY_STATUS_QUERY = gql`
  query GetAllTasksByStatus($status: String!) {
    getAllTasksByStatus(status: $status) {
      id
      createdAt
      status
      title
      description
      createdById
      assignedToId
      isCompleted
      isArchived
      position
    }
  }
`

export const GET_USER_TASKS_BY_STATUS_QUERY = gql`
  query GetUserTasksByStatus($userId: Int!, $status: String!) {
    getUserTasksByStatus(userId: $userId, status: $status) {
      id
      createdAt
      status
      title
      description
      createdById
      assignedToId
      isCompleted
      isArchived
      position
    }
  }
`

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      email
    }
  }
`
