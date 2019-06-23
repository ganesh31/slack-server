export default `
type User {
  id: Int!
  username: String!
  email: String!
  teams: [Team!]!
}

type RegisterResponse {
  ok: Boolean!
  user: User
  errors: [Error!]
}

type VoidResponse {
  ok: Boolean!
}

type LoginResponse {
  ok: Boolean!
  token: String
  refreshToken: String
  errors: [Error!]
}

type Query {
  getUser(id: Int!): User!
  allUsers: [User!]!
  doesUserExists(username: String!): Boolean!
}

type Mutation {
  register(username: String!, email: String!, password: String!): RegisterResponse!
  login(username: String!, password: String!): LoginResponse!
}

`;
