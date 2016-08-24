var express = require('express');
var app = express();

app.use(express.static(__dirname));

var port = process.env.PORT || 3000
app.listen(port, "0.0.0.0");

console.log("Listining on http://localhost:" + port)