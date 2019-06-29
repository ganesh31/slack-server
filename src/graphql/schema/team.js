export default `
type Team {
  id: Int!
  name: String!
  owners: User!
  members: [User!]!
  channels: [Channel!]!
}

type CreateTeamResponse {
  ok: Boolean!
  errors: [Error!]
}

type Query {
  allTeams: [Team!]!
}

type Mutation {
  createTeam(name: String!): CreateTeamResponse!
}
`;
