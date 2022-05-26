export const GET_ALL_TASKS_QUERY = gql`
  query GetAllTasks {
    getAllTasks {
      id
      createdAt
      status
      title
      description
      createdById
      assignedToId
      isCompleted
      isArchived
    }
  }
`

export const GET_PENDING_TASKS_QUERY = gql`
  query GetAllPendingTasks {
    getAllPendingTasks {
      id
      createdAt
      status
      title
      description
      createdById
      assignedToId
      isCompleted
      isArchived
    }
  }
`

export const GET_TASKS_CREATED_BY_USER_QUERY = gql`
  query GetTasksCreatedByUser($userId: Int!) {
    getTasksCreatedByUser(userId: $userId) {
      id: Int!
      createdAt
      status
      title
      description
      createdById
      assignedToId
      isCompleted
      isArchived
    }
  }
`
export const GET_TASKS_ASSIGNED_TO_USER_QUERY = gql`
  query GetTasksAssignedToUser($userId: Int!) {
    getTasksAssignedToUser(userId: $userId) {
      id: Int!
      createdAt
      status
      title
      description
      createdById
      assignedToId
      isCompleted
      isArchived
    }
  }
`
