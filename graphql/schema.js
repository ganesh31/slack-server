export default `
type Team {
  owners: User!
  members: [User!]!
  channels: [Channel!]!
}

type Channel {
  id: Int!
  name: String!
  message: [Message!]!
}

type Message {
  id: Int!
  text: String!
  user: User!
  channel: Channel!
}

type User {
  id: Int!
  username: String!
  email: String!
  messages: Message!
}

type Query {
  hello: String
}`;
