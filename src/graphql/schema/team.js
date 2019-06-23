export default `
type Team {
  owners: User!
  members: [User!]!
  channels: [Channel!]!
}

type CreateTeamResponse {
  ok: Boolean!
  errors: [Error!]
}

type Mutation {
  createTeam(name: String!): CreateTeamResponse!
}
`;
