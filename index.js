// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Instantiate server
const server = http.createServer((req, res) => {
  // Parse URL
  let parsedUrl = url.parse(req.url, true);

  // Get path
  let path = parsedUrl.path.replace(/^\/+|\/+$/g, '');

  // Get the HTTP Headers
  let headers = req.headers;

  // Get HTTP method
  let method = req.method.toUpperCase();

  // Get Payload
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Choose handler
    let chosenHandler =
      typeof router[path] !== 'undefined' ? router[path] : handlers.notfound;

    // sent data
    let data = {
      path: path,
      method: method,
      headers: headers,
      payload: buffer
    };

    // Route to hanlder
    chosenHandler(data, (statusCode, payload) => {
      // Default to status code 200 if no code found
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Default payload to empty or use hanlder
      payload = typeof payload === 'object' ? JSON.stringify(payload) : {};

      // Set content type and status code
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);

      // Send response
      res.end(payload);
    });
  });
});

// Run server
server.listen(3000, () => {
  console.log('Started Server');
});

// Define API handlers
const handlers = {};

// Hello Hanlder
handlers.hello = (data, callback) => {
  callback(200, { response: 'Hello World!' });
};

// Not Found Hanlder
handlers.notfound = (data, callback) => {
  callback(404, { response: 'Not Found' });
};

// Define request routers
const router = {
  hello: handlers.hello
};
