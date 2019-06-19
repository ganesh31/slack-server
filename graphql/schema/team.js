export default `
type Team {
  owners: User!
  members: [User!]!
  channels: [Channel!]!
}

type Mutation {
  createTeam(name: String!): Boolean!
}
`;
