const express = require("express");
//OJO express-graphql dependency change, NOW you should get the (graphqlHTTP) function with destructuring syntax
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const events = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
          events: [Event!]!
      }

      type RootMutation {
          createEvent (eventInput: EventInput): Event
      }

      schema {
          query: RootQuery
          mutation: RootMutation
      }
    `),

    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (arg) => {
        const event = {
          _id: Math.random.toString(),
          title: arg.eventInput.title,
          description: arg.eventInput.description,
          price: +arg.eventInput.price,
          date: arg.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);

console.log("Running a GraphQL API server at localhost:3000/graphql");