/*
	Lanceur.
 */
var server = require("./server");
var router = require("./router");
//var requestHandlers = require("./requestHandlers");
var requestHandlers = require("./requestHandlers");
//var oRequestHandlers = new requestHandlers();
var handle = {}

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/play"] = requestHandlers.play;
handle["/admin"] = requestHandlers.admin;
handle["/liste"] = requestHandlers.liste;
handle["/edit"] = requestHandlers.edit;
handle["/delete"] = requestHandlers.suppr;

server.start(router.route, handle);
