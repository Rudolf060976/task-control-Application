export const CREATE_TASK_MUTATION = gql`
  mutation CreateTaskMutation($userId: Int!, $input: CreateTaskInput!) {
    createTask(userId: $userId, input: $input) {
      id: Int!
      createdAt: DateTime
      status: String!
      title: String!
      description: String!
      createdById: Int!
      assignedToId: Int
      isCompleted: Boolean
      isArchived: Boolean
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
      id: Int!
      createdAt: DateTime
      status: String!
      title: String!
      description: String!
      createdById: Int!
      assignedToId: Int
      isCompleted: Boolean
      isArchived: Boolean
    }
  }
`
export const COMPLETE_TASK_MUTATION = gql`
  mutation CompleteTaskMutation($userId: Int!, $taskId: Int!) {
    completeTask(userId: $userId, taskId: $taskId) {
      id: Int!
      createdAt: DateTime
      status: String!
      title: String!
      description: String!
      createdById: Int!
      assignedToId: Int
      isCompleted: Boolean
      isArchived: Boolean
    }
  }
`
export const UNASSIGN_TASK_MUTATION = gql`
  mutation UnassignTaskMutation($taskId: Int!) {
    unassignTask(taskId: $taskId) {
      id: Int!
      createdAt: DateTime
      status: String!
      title: String!
      description: String!
      createdById: Int!
      assignedToId: Int
      isCompleted: Boolean
      isArchived: Boolean
    }
  }
`

export const ARCHIVE_TASK_MUTATION = gql`
  mutation ArchiveTaskMutation($taskIds: [Int!]!) {
    archiveTask(taskIds: $taskIds)
  }
`
