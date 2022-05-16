const { ApolloServer, gql, UserInputError } = require("apollo-server");
const users = require("./models/UserModel");
const products = require("./models/ProductModel");
const orders = require("./models/OrderModel");
const shops = require("./models/ShopModel");
const categories = require("./models/CategoryModel");

const resolvers = {
  Query: {
    products: async () => {
      return products;
    },
    getUserById: async (parent, { userId }, context) => {
      const user = await users.findOne({
        _id: userId,
      });
      return user;
    },
    getShopAvailability: async (parent, { shopName }, context) => {
      const shop = await shops.findOne({
        shopName: shopName,
      });
      if (shop !== null) {
        return UserInputError("User already exists");
      } else {
        const result = {
          result: "Shopname available",
        };
        // console.log("data", returnUser);
        return result;
      }
    },
    getShopByUserId: async (parent, { ownerId }, context) => {
      const shop = await shops.findOne({
        ownerId: ownerId,
      });
      return shop;
    },
    getOrdersByCustomerId: async (parent, { userId }, context) => {
      const order = await orders.find({
        customerId: userId,
      });
      return order;
    },
    getProductByProductId: async (parent, { productId }, context) => {
      const product = await products.findOne({
        _id: productId,
      });
      return product;
    },
    categories: async () => {
      return categories;
    },
  },
  Mutation: {
    addUser: async (parent, { email, name, password }, context) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const response = await users.findOne({
        email: email,
      });
      if (response === null) {
        console.log("here");
        var newUser = new users({
          name: name,
          email: email,
          password: hashedPassword,
        });
        const user = await newUser.save();
        console.log(user);
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          shopname: user.shopname,
          dob: user.dob,
          country: user.country,
          address: user.address,
          city: user.city,
          about: user.about,
          pic: user.pic,
          phone: user.phone,
        };
        console.log(payload);
        console.log("user created", response);
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        console.log("jwt", token);
        const returnUser = {
          token: "JWT " + token,
        };
        // console.log("data", returnUser);
        return returnUser;
      } else {
        UserInputError("User already exists");
      }
    },
    loginUser: async (parent, { email, password }, context) => {
      console.log("here");
      let inputPassword = password;
      const response = await users.findOne({
        email: email,
      });
      const result = await bcrypt.compare(password, response.password);
      if (result) {
        const payload = {
          _id: response._id,
          name: response.name,
          email: response.email,
          shopname: response.shopname,
          dob: response.dob,
          country: response.country,
          address: response.address,
          city: response.city,
          about: response.about,
          pic: response.pic,
          phone: response.phone,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        const returnUser = {
          token: "JWT " + token,
        };
        console.log(returnUser);
        return returnUser;
      }
    },
    addProduct: async (
      parent,
      { name, price, instock, category, description, image, shopname },
      context
    ) => {
      console.log("here");
      var newProducts = new products({
        name: name,
        price: price,
        instock: instock,
        category: category,
        description: description,
        image: image,
        shopname: shopname,
      });

      const product = await newProducts.save();
      const status = {
        token: "Product Added",
      };
      return status;
    },
    update: async (
      parent,
      { name, price, instock, category, description, image, shopname },
      context
    ) => {
      console.log("here");
      var updateProduct = new products({
        name: name,
        price: price,
        instock: instock,
        category: category,
        description: description,
        image: image,
        shopname: shopname,
      });

      const product = await updateProduct.save();
      const status = {
        token: "Product Updated",
      };
      return status;
    },
  },
};
