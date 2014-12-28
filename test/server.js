/*
 * Authored by  AlmogBaku
 *              almog.baku@gmail.com
 *              http://www.almogbaku.com/
 *
 * 27/12/14 21:20
 */

var express = require('express');
var app = express();

app.use(express.static(__dirname+'/..'));

app.listen(8081, function () {
  var host = (process.env.HTTP_HOST || this.address().address);
  var port = this.address().port;

  console.log('Example app listening at http://%s:%s/test/', host, port);
});