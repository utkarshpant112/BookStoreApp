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

  type Shop {
    _id: ID!
    ownerId: String!
    shopname: String!
    shopimage: String!
    result: String!
  }

  type Product {
    _id: ID!
    name: String!
    price: Float!
    instock: Int!
    category: String!
    description: String!
    shopname: String!
    image: String!
    totalsales: Int!
    result: String!
  }

  type Order {
    _id: ID!
    name: String!
    price: Float!
    quantity: Int!
    dateofpurchase: String!
    customerId: String!
    currency: String!
    shopname: String!
    isgiftwrapped: String!
    description: String!
    image: String!
    result: String!
  }

  type Category {
    _id: ID!
    value: String!
    label: String!
    result: String!
  }

  type Query {
    getUserById(userId: String): User
    getShopAvailability(shopname: String): Shop
    getShopByUserId(ownerId: String): Shop
    getShopByShopId(shopId: String): Shop
    getOrdersByCustomerId(userId: String): [Order]
    getOtherProductsByuserId(userId: String): [Product]
    getProductByProductId(productId: String): Product
    getProducts: [Product]
  }
  type Mutation {
    addUser(email: String!, name: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    addProduct(
      name: String!
      price: Float!
      instock: Int!
      category: String!
      description: String!
      image: String!
      shopname: String!
    ): Product
    updateUser(
      name: String
      email: String
      phone: String
      dob: String
      about: String
      pic: String
      address: String
      city: String
      country: String
    ): User
    createShop(shopName: String, email: String): Shop
    addProduct(name: String, price: Float,instock: String,category: String,description :String, image: String, shopname:String) : Product
    updateProduct(name: String, price: Float,instock: String,category: String,description :String, image: String, shopname:String) : Product
    createOrder(name: String, price: Float,quantity: Int,isgiftwrapped:String,dateofpurchase:String,category: String,description : String, image: String, shopname:String,currency:String)
  }
`;

module.exports = typeDefs;
