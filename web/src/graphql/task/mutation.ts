export const CREATE_TASK_MUTATION = gql`
  mutation CreateTaskMutation($userId: Int!, $input: CreateTaskInput!) {
    createTask(userId: $userId, input: $input) {
      id
      createdAt
      status
      title
      description
      createdById
      isCompleted
      isArchived
      position
      completedById
      completedAt
    }
  }
`
export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTaskMutation($userId: Int!, $taskId: Int!) {
    deleteTask(userId: $userId, taskId: $taskId)
  }
`
export const ASSIGN_TASK_MUTATION = gql`
  mutation AssignTaskMutation($userIds: [Int!]!, $taskId: Int!) {
    assignTask(userIds: $userIds, taskId: $taskId)
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
      isCompleted
      isArchived
      position
      completedById
      completedAt
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
      isCompleted
      isArchived
      position
      completedById
      completedAt
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

export const UNASSIGN_TASK_BY_USER_MUTATION = gql`
  mutation unassignTaskByUserMutation($taskId: Int!, $userId: Int!) {
    unassignTaskByUser(taskId: $taskId, userId: $userId)
  }
`
