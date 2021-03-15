require('dotenv').config();
const { MongoClient } = require('mongodb');

// global var which we will assign the DB to.
let db;

async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb://localhost/issueTracker';
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB at', url);
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function getDb(){
  return db;
}

module.exports = { getNextSequence, connectToDb, getDb };