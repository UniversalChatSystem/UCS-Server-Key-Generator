const express = require('express');
const app = express();
const cuid = require('cuid');

app.get('/', function (req, res) {
  res.send('Hello World!')
})

console.log( cuid() );

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
