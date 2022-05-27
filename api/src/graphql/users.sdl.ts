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
    getAllTasksByStatus(status: String!): [Task!]! @skipAuth
    getUserTasksByStatus(userId: Int!, status: String!): [Task!]! @skipAuth
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
    changeTaskStatus(userId: Int!, taskId: Int!, status: String!): Task
      @skipAuth
    unassignTask(taskId: Int!): Task @skipAuth
    archiveTasks(taskIds: [Int!]!): Boolean! @skipAuth
    updateTaskPositions(input: [TaskPositionInput!]!): Boolean! @skipAuth
    deleteAllTasks: Boolean! @skipAuth
  }
`
