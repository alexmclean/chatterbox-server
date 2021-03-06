/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require("fs");

var data = '';
var results = [];
var readerStream;
var writerStream;
var id = 1;

var streamInit = false;

  
var requestHandler = function(request, response) {


  if(streamInit === false) {
    // Create a readable stream
    readerStream = fs.createReadStream('input.txt');
    writerStream = fs.createWriteStream('input.txt');

  // Set the encoding to be utf8. 
    readerStream.setEncoding('UTF8');
    streamInit = true;
  }



  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  //headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  if(request.method === "OPTIONS"){
    response.writeHead(statusCode, headers);
    headers['Content-Type'] = "text/plain";
    response.end(headers['access-control-allow-methods'] ); 

  } else if(request.method === "POST"){
    var parsedObj;
    // Handle stream events --> data, end, and error
    request.on('data', function(chunk) {
       data += chunk;
    });

    request.on('end',function(){
       parsedObj = JSON.parse(data);
       parsedObj.objectId = id;
       id++;
       console.log(parsedObj);
       results.push(parsedObj);
       writerStream.write(JSON.stringify(parsedObj),'UTF8');
       data = '';
    });

    request.on('error', function(err){
       console.log(err.stack);
    });

    response.writeHead(statusCode, headers);
    //results = results.concat([{username: "alex", text: "you found our server", objectId: id}]);

    var finalResult = JSON.stringify(parsedObj);
    response.end(finalResult);
    
    console.log("trying to post");

  } else {
 
    fs.readFile('input.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log("Hello data " + data);
    });




    response.writeHead(statusCode, headers);
    results = results.concat([{username: "alex", text: "you found our server", objectId: id}]);
    id++;

    var finalResult = JSON.stringify({results: results});
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.
    response.end(finalResult);
  }
  




};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "Origin, X-Requested-With, content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;

