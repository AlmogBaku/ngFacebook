/*
 * Authored by  AlmogBaku
 *              almog.baku@gmail.com
 *              http://www.almogbaku.com/
 *
 * 27/12/14 21:20
 */

var express = require('express');
var app = express();

app.use(express.static(__dirname+'/../..'));

var port = process.env.HTTP_PORT || 8081;
app.listen(port, function () {
  var host = (process.env.HTTP_HOST || this.address().address);

  console.log('Example app listening at http://%s:%s/test/', host, port);
});