const express = require("express");
//OJO express-graphql dependency change, NOW you should get the (graphqlHTTP) function with destructuring syntax
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require('./models/event')
const app = express();

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
        return Event
        .find()
        .then(events => {
          return events.map(event => {
            return { ...event._doc }
          });
        }).catch(err => {
          console.log(err);
          throw err;
        });
      },
      createEvent: (arg) => {
        const event = new Event ({
          title: arg.eventInput.title,
          description: arg.eventInput.description,
          price: +arg.eventInput.price,
          date: arg.eventInput.date,
        });
        return event
        .save()
        .then(result => {
          console.log(result);
          return { ...result._doc };
        }).catch(err => {
          console.log(err);
          throw err;
        });
      },
    },
    graphiql: true,
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clusteratlas.wnue9.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
  app.listen(3000);
}).catch(err => {
  console.log(err);
  throw(err);
});

console.log("Running a GraphQL API server at localhost:3000/graphql");