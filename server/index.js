const http = require('http');
const debug = require('debug')('yandex-shri-2018-homework-4-5-6:server');

const app = require('./app');
const normalizePort = require('./helpers/normalizePort');
const config = { ...require('./../config.json'), ...require('./data/data.json') };

// Get port from environment and store in Express.
const PORT = normalizePort(process.env.PORT || config.port);
app.set('port', PORT);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(PORT);

server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
});
