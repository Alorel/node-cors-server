const cluster = require('cluster'),
    stopSignals = [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ],
    production = process.env.NODE_ENV == 'production';

let stopping = false;

cluster.on('disconnect', function (worker) => {
    if (production) {
        if (!stopping) {
            cluster.fork();
        }
    } else {
        process.exit(1);
    }
});

if (cluster.isMaster) {
    const workerCount = process.env.NODE_CLUSTER_WORKERS || 4;
    console.log(`Starting ${workerCount} workers...`);
    for (let i = 0; i < workerCount; i++) {
        cluster.fork();
    }
    if (production) {
        stopSignals.forEach(function (signal) {
            process.on(signal, function () {
                console.log(`Got ${signal}, stopping workers...`);
                stopping = true;
                cluster.disconnect(function () {
                    console.log('All workers stopped, exiting.');
                    process.exit(0);
                });
            });
        });
    }
} else {
    const app = require('./app');
    const debug = require('debug')('cors-proxy:server');

    const normalizePort = val => {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }

        return false;
    };

    const port = normalizePort(process.env.NODE_PORT || process.env.PORT || 3000);
    app.set('port', port);

    const server = require('http').createServer(app);

    server.listen(port, process.env.NODE_IP || 'localhost');


    const onError = error => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    const onListening = () => {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;

        console.log('Listening on ' + bind);
    };

    server.on('error', onError);
    server.on('listening', onListening);
}
