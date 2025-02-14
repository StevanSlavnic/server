#!/usr/bin/env node

import app from "../app";
import { connectDb } from "../configs/mongoose";
import debugLib from "debug";
import http from "http";
import User from "../models/user";
import Location from "../models/location";

// clear MongoDB records when starting the Application
const clearDbOnStart = process.env.CLEAR_DB_ON_START === "true" ? true : false;
const debug = debugLib("fileserver:server");
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.GROUPIVE_FILESERVER_PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

connectDb()
  .then(async () => {
    if (clearDbOnStart) {
      await User.deleteMany({});
      await Location.deleteMany({});
    }
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch(error => {
    console.log("Error", error);
  });

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
