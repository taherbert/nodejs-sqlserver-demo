const fs = require('fs')
const Promise = require('bluebird')
const sql = require('mssql')
sql.Promise = require('bluebird')
const express = require('express')
const app = express()

// Database configuration
const sqlConfig = {
  user: 'dometrics-etl',
  password: 'gHfmpF6d3uMFaF6',
  server: 'Devs-ais-etl.ou.ad3.ucdavis.edu',
  database: 'ETL_Core',
  options: { encrypt: true }
}

app.listen(9999, function () {
  console.log('API listening on port 9999!')
})

// Basic GET endpoint
// We are reading a text file as a string, then connecting to the SQL DB and
// performing a query. The data set is returned as an object and sent to client.
// Once the data has been sent (or error is caught), the connection is cloesd.
app.get('/allocations', (req, res) => {

  fs.readFile('./asgpAllocations.txt', function (err, data) {
    if (err) { throw err }
    let query = data.toString()

    sql.connect(sqlConfig)
    .then(()=> { return makeRequest(query) })
    .then((data) => { res.send(data) })
    .finally(() => { sql.close() })
    .catch(err => console.dir(err))
  })

})

// Generic request - very simple implementation, could be expanded
function makeRequest(query) {
  return new Promise( (resolve, reject) => {
    new sql.Request().query(query)
    .then(recordset => resolve(recordset))
    .catch(err => console.dir(err))
  })
}
