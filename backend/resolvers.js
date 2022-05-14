const resolvers = {
  Query: {
    users: async () => {
      return users;
    },
  },
  Mutation: {
    addUser: async (parent, { email, name, password }, context) => {
      const new1User = {
        email: email,
        name: name,
        password: password,
      };
      const newUser = new users({
        email: email,
        name: name,
        password: password,
      });

      const response = await newUser.save();

      if (response) {
        console.log("user created", response);
        const token = jwt.sign(new1User, secret, {
          expiresIn: 1008000,
        });
        console.log("jwt", token);
        const returnUser = {
          _id: response._id,
          email: response.email,
          token: token,
        };
        // console.log("data", returnUser);
        return returnUser;
      } else {
        console.log("user not created");
      }
    },
  },
};
