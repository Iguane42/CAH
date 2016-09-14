var server = require("./server");
var router = require("./router");
//var requestHandlers = require("./requestHandlers");
var requestHandlers = require("./requestHandlers");
//var oRequestHandlers = new requestHandlers();
var handle = {}

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/test"] = requestHandlers.test;
handle["/play"] = requestHandlers.play;

server.start(router.route, handle);
