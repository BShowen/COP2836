// See top of page 101 to understand what this does.
const fs = require('fs');
require('dotenv').config();
// This statement imports the express code (which returns a function)
// that we will use to instantiate our application.
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb://localhost/issueTracker';
const port = process.env.API_SERVER_PORT || 3000;

// global var which we will assign the DB to.
let db;

let aboutMessage = 'Issue Tracker API v1.0';

// Custom type for GraphQLSchema
const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return Number.isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value);
      return Number.isNaN(value) ? undefined : value;
    }
    return undefined;
  },
});

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function issueValidate(issue) {
  const anyErrors = [];
  if (Number.isNaN(issue.effort)) {
    anyErrors.push('Field "effort" can accept only integers.');
  }
  if (issue.title.length < 3) {
    anyErrors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    anyErrors.push('Field "owner" is required when status is "Assigned"');
  }
  if (anyErrors.length > 0) {
    throw new UserInputError('Invalid input(s)', { anyErrors });
  }
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function issueAdd(_, { issue }) {
  issueValidate(issue);
  const newIssue = Object.assign({}, issue);
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues');
  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
  return savedIssue;
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const app = express();

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

// This weird looking syntax is an immediately invoked async function expression.
// You define the async function within (here)();
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port: ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());

