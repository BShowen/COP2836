const { getDb, getNextSequence } = require('./db.js');

const { UserInputError } = require('apollo-server-express');

async function list() {
  const db = getDb();
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

function validate(issue) {
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

async function add(_, { issue }) {
  const db = getDb();
  validate(issue);
  const newIssue = Object.assign({}, issue);
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues');
  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
  return savedIssue;
}

module.exports = { list, add };