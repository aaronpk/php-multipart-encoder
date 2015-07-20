// Node.js requires a third party library to do multipart parsing
// This is ostly taken from the example at https://github.com/mscdex/busboy

var http = require('http');

var Busboy = require('busboy');

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });

    var files = {};
    var fields = {};

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      files[fieldname] = files[fieldname] || [];
      files[fieldname].push(filename);

      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      fields[fieldname] = fields[fieldname] || [];
      fields[fieldname].push(val);
    });

    busboy.on('finish', function() {
      console.log('Files:', files);
      console.log('Fields:', fields);

      res.writeHead(200);
      res.end();
    });

    req.pipe(busboy);
  } else {
    res.writeHead(400);
    res.end();
  }
}).listen(8000, function() {
  console.log('Listening for requests');
});