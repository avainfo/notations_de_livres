const http = require('http');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || 4000;
app.set('port', port);

const server = http.createServer(app);

server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port);
