export const schema = gql`
  type Task {
    id: Int!
    createdAt: DateTime
    status: String!
    title: String!
    description: String!
    createdById: Int!
    isCompleted: Boolean
    isArchived: Boolean
    position: Int!
    completedById: Int
    completedAt: DateTime
  }

  input CreateTaskInput {
    title: String!
    description: String!
  }

  input TaskPositionInput {
    id: Int!
    position: Int!
  }
`
