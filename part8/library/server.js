const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

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
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer