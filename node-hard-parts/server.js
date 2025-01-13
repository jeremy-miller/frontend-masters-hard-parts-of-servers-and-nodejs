const http = require("http");
const fs = require("fs");

function doOnRequest(request, response) {
  // Send back a message saying "Welcome to Twitter"
  // response.end("Welcome to Twitter");
  if (request.method === "GET" && request.url === "/") {
    // read the index.html file and send it back to the client
    const content = fs.readFileSync("./index.html");
    response.end(content);
  } else if (request.method === "GET" && request.url === "/style.css") {
    const content = fs.readFileSync("./style.css");
    response.end(content);
  } else if (request.method === "POST" && request.url === "/sayHi") {
    // code here...
    fs.appendFileSync("hi_log.txt", "Somebody said hi.\n");
    response.end("hi back to you!");
  } else if (request.method === "PUT" && request.url === "/update") {
    let body = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const bodyMessage = body.join();
        fs.writeFileSync("hi_log.txt", `${bodyMessage}\n`);
        response.end();
      });
  } else if (request.method === "DELETE" && request.url === "/delete") {
    fs.unlinkSync("hi_log.txt");
    response.end();
  } else if (request.method === "POST" && request.url === "/greeting") {
    // accumulate the request body in a series of chunks
    let body = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const bodyMessage = body.join();
        fs.appendFileSync("hi_log.txt", `${bodyMessage}\n`);
        if (bodyMessage === "hello") {
          response.end("hello there!");
        } else if (bodyMessage === "what's up") {
          response.end("the sky");
        } else {
          response.end("good morning");
        }
      });
  } else {
    // Handle 404 error: page not found
    response.statusCode = 404;
    response.end("Error: Not Found");
  }
}

const server = http.createServer(doOnRequest);

server.listen(3000);
