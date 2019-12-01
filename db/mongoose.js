const mongoose = require('mongoose');


//const mongoUserURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/UserAPI';
//const mongoFileURI = process.env.MONGODB_URI || 'mongodb://localhost:27022/FileAPI';
//const mongoFileSystemURI = process.env.MONGODB_URI || 'mongodb://localhost:27023/file-system';

// connect to our database
//mongoose.connect(mongoUserURI, { useNewUrlParser: true, useCreateIndex: true});
//mongoose.connect(mongoFileURI, { useNewUrlParser: true, useCreateIndex: true});
//mongoose.connect(mongoFileSystemURI, { useNewUrlParser: true, useCreateIndex: true});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://hadi:UwVxAnL8aOABbrFiAPmt@ds221416.mlab.com:21416/heroku_k4wwnj9d"


mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});

module.exports = { mongoose };
