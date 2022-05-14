const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    name: String!
    password: String!
    shopname: String!
    dob: String!
    address: String!
    city: String!
    country: String!
    about: String!
    pic: String!
    phone: String!
    token: String!
  }

  type Query {
    users: [User]
  }
  type Mutation {
    addUser(email: String!, name: String!, password: String!): User
  }
`;

module.exports = typeDefs;
