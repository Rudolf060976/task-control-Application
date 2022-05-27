export const CREATE_TASK_MUTATION = gql`
  mutation CreateTaskMutation($userId: Int!, $input: CreateTaskInput!) {
    createTask(userId: $userId, input: $input) {
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
export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTaskMutation($userId: Int!, $taskId: Int!) {
    deleteTask(userId: $userId, taskId: $taskId)
  }
`
export const ASSIGN_TASK_MUTATION = gql`
  mutation AssignTaskMutation($userId: Int!, $taskId: Int!) {
    assignTask(userId: $userId, taskId: $taskId) {
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
export const CHANGE_TASK_STATUS_MUTATION = gql`
  mutation ChangeTaskStatusMutation(
    $userId: Int!
    $taskId: Int!
    $status: String!
  ) {
    changeTaskStatus(userId: $userId, taskId: $taskId, status: $status) {
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
export const UNASSIGN_TASK_MUTATION = gql`
  mutation UnassignTaskMutation($taskId: Int!) {
    unassignTask(taskId: $taskId) {
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

export const ARCHIVE_TASKS_MUTATION = gql`
  mutation ArchiveTasksMutation($taskIds: [Int!]!) {
    archiveTasks(taskIds: $taskIds)
  }
`

export const UPDATE_TASK_POSITIONS_MUTATION = gql`
  mutation UpdateTaskPositionsMutation($input: [TaskPositionInput!]!) {
    updateTaskPositions(input: $input)
  }
`
export const DELETE_ALL_TASKS_MUTATION = gql`
  mutation DeleteAllTasksMutation {
    deleteAllTasks
  }
`
