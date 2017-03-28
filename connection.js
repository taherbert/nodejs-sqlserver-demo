var Connection = require('tedious').Connection
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var sql = require('mssql');

var config = {
  userName: 'ta.herbert',
  password: 'Mochi!13',
  server: 'co6vd2ug92.database.windows.net',
  options: {encrypt: true, database: 'NodeTest'}
};

var connection = new Connection(config);

connection.on('connect', function(err) {
  if (err) { console.dir(err) }
  console.log('success')
  // If no error, then good to go...
    // executeStatement();
  }
);

// const config = {
//     user: 'ta.herbert',
//     password: 'Mochi!13',
//     server: 'co6vd2ug92.database.windows.net',
//     database: 'NodeTest',
//     options: {
//         encrypt: true // Use this if you're on Windows Azure
//     }
// }
//
// sql.connect(config).then(() => {
// 	console.log('connected')
// }).catch(err => {
//   console.log(err)
// })
