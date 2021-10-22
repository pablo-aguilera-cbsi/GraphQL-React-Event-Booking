const express = require("express");
//OJO express-graphql dependency change, NOW you should get the (graphqlHTTP) function with destructuring syntax
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery {
          events: [String!]!
      }

      type RootMutation {
          createEvent (name: String): String
      }

      schema {
          query: RootQuery
          mutation: RootMutation
      }
    `),

    rootValue: {
      events: () => {
        return ['Romantic Cooking', 'Sailing', 'All Night Coding'];
      },
      createEvent: (arg) => {
        const eventName = arg.name
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);

console.log("Running a GraphQL API server at localhost:3000/graphql");