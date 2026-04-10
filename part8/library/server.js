const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");
const User = require("./models/user");

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  try {
    const token = auth.substring(7).trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    return await User.findById(decodedToken.id);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return null;
  }
  // const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  // return User.findById(decodedToken.id)
};

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    cors: {
      origin: "*", // Replace with your frontend's URL
      credentials: true,
    },
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      const currentUser = await getUserFromAuthHeader(auth);
      return { currentUser };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer;
