export const schema = gql`
  type Task {
    id: Int!
    createdAt: DateTime
    status: String!
    title: String!
    description: String!
    createdById: Int!
    assignedToId: Int
    isCompleted: Boolean
  }

  input CreateTaskInput {
    title: String!
    description: String!
  }
`
