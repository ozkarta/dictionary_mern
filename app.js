// Get dependencies
global.__basedir = __dirname;

const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const ws = require('ws');
// Initial and Config Server.
const app = express();
const server = http.Server(app);
const WebSocketServer = ws.Server

const config = require('./config');
// Mongoose setup
mongoose.Promise = global.Promise;
if (process.env.DB_CONNECTION || config.DB_CONNECTION) {
    mongoose.connect(process.env.DB_CONNECTION || config.DB_CONNECTION);
    const db = mongoose.connection;
    db.on('error', function(err){
        console.error(err);
    });
    db.once('open', function callback () {
        console.info('Connected to the database');
    });
    app.use(session({
        secret: 'ozkarta',
        store: new MongoStore({
            mongooseConnection: db,
            ttl: 3600 * 24 * 60, // 2 months
            touchAfter: 3600 * 24 * 2
        }),
        unset: 'destroy',
        cookie: { maxAge: (3600000 * 24 * 60) }, // 2 months
        resave: false,
        saveUninitialized: true
    }));
} else {
    console.log('DB connection string was not found.');
}

// Parsers for POST data
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Point static path to "build" (react app)
app.use(express.static(path.join(__dirname, 'build')));


// Get our API routes
app.use(function (req, res, next) {
    let allowedOrigins = [
        'http://localhost:4201',
        'http://localhost:4202',
        'http://thedict.ge',
        'https://thedict.ge'
    ];
    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '127.0.0.1');
    }
    

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    next();
});
const routes = require('./api/v1/routes/routes')(express);

// Web Socket Handler
//const chatServerHandler = require('./api/v1/ws/chat-server.socket').chatServerHandler;

// Set our api routes
app.use('/api/v1', routes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});
/*** Get port from environment and store in Express.*/
const port = process.env.PORT || 4000;
app.set('port', port);

server.listen(port, () => console.log(`Our server is running on: ${port}`));

// let wss =new WebSocketServer({ server: server });
// wss.on('connection', chatServerHandler);