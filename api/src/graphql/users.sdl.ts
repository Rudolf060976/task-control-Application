export const schema = gql`
  type User {
    id: Int!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
    getAllTasks: [Task!]! @skipAuth
    getAllPendingTasks: [Task!]! @skipAuth
    getTasksCreatedByUser(userId: Int!): [Task!]! @skipAuth
    getTasksAssignedToUser(userId: Int!): [Task!]! @skipAuth
  }

  input CreateUserInput {
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateUserInput {
    email: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    createTask(userId: Int!, input: CreateTaskInput!): Task! @skipAuth
    deleteTask(userId: Int!, taskId: Int!): Boolean! @skipAuth
    assignTask(userId: Int!, taskId: Int!): Task @skipAuth
    completeTask(userId: Int!, taskId: Int!): Task @skipAuth
    unassignTask(taskId: Int!): Task @skipAuth
    archiveTasks(taskIds: [Int!]!): Boolean! @skipAuth
    updateTaskPositions(input: [TaskPositionInput!]!): Boolean! @skipAuth
  }
`
