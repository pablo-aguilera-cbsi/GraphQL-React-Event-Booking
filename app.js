const express = require("express");
//OJO express-graphql dependency change, NOW you should get the (graphqlHTTP) function with destructuring syntax
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get a simple message in the browser with node-express server
app.get('/', (req, res, next) => {
  res.send('Hellow World!!');
})

app.listen(3000);

console.log("Running a GraphQL API server at localhost:3000/graphql");