const { getDb, getNextSequence } = require('./db.js');

const { UserInputError } = require('apollo-server-express');

async function get(_, { id }){
  const db = getDb();
  const issue = await db.collection('issues').findOne({id});
  return issue;
}

async function list(_, { status, effortMin, effortMax}) {
  const db = getDb();
  const filter = {};
  if (status) filter.status = status;

  if (effortMin !== undefined || effortMax !== undefined){
    /* 
    This comment is about the three lines of code following this comment. 
    This filter works because if you want to filter in Mongo you use the 
    syntax {documentField : {$gte: someValue}} for example we can say 
    we want all user with an age >= 18 with this filter {age: {$gte: 18}}. 
    When we create this filter we are creating a key with the keyName 
    as the same name as the field we are filtering on: effort. 
    We create this filter in a way that the structure looks like this
    filter = { effort: { $gte: values }}. We can see the structure by 
    console logging the filter object, when running a query with a filter. 
    You can use this query in the playground: 
    query{
      issueList(effortMin: 0 effortMax: 10){
        id effort
      }
    }
    And then uncomment the console.log statement below. 
    */
   filter.effort = {};
   if (effortMin !== undefined) filter.effort.$gte = effortMin;
   if (effortMax !== undefined) filter.effort.$lte = effortMax;
  //  console.log("inside issue.js/list()/filter = ", filter);
  }
  const issues = await db.collection('issues').find(filter).toArray();
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

module.exports = { list, add, get };