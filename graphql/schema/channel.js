export default `
type Channel {
  id: Int!
  name: String!
  message: [Message!]!
}

type Mutation {
  createChannel(teamId: Int!,name: String!, public: Boolean=false): Boolean!
}
`;
