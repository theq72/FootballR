var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var logger = require('morgan'); //logs out information in terminal
var MongoStore = require('connect-mongo')(session);
var async = require('async');
var socket = require('socket.io');    // Socket.io binding

mongoose.connect('mongodb://localhost:27017/playertest', { useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;

var routes = require('./routes/index');
var players = require('./routes/players');
var matchup = require('./routes/matchup');
var standings = require('./routes/standings');
var myTeam = require('./routes/myTeam');
var users = require('./routes/users');
var draft = require('./routes/draft'); 
var viewTeam = require('./routes/viewTeam');

//Yo dawg test.
// Init App
var app = express();

// local variable to be displayed in program
app.locals.playerdata = require("./playerdata.json");

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
app.set ('view engine', 'ejs');

// BodyParser Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: db }),
    // Session expires after 3 hours 
    cookie: {maxAge: 180 * 60 * 1000}
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});



app.use('/', routes);
app.use('/players', players);
app.use('/matchup', matchup);
app.use('/myTeam', myTeam);
app.use('/standings', standings);
app.use('/users', users);
app.use('/draft', draft);
app.use('/viewTeam', viewTeam);

// Set Port
app.set('port', (process.env.PORT || 3000));

// Create server and set express app to listen to on port 3000.
var server = app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});


/* New editions for socket functionality, still being worked on. */
// Socket.io now listens on our server for requests.
var io = socket(server);

let hosts = [];                     // Will hold the socket ID's of connected users.
let currentTurn = 0;                // Increments when the turn is passed.                        
let turn = 0;                       // Used to track which user's turn it is.
let timeout;
const MAXTIME = 15000;              // 15 second timer.

// Keeps track and triggers the next user's turn.
function nextTurn()
{

  // Increments current turn number, uses modulo to determine the next user's turn (via array index).
  turn = currentTurn++ % hosts.length;
  hosts[turn].emit('yourturn');
  console.log("Next turn triggered: " , turn);
  triggerTimeout();

}

// Triggered by nextTurn() or if 15 seconds is reached: Creates 'autodraft' event.
function triggerTimeout()
{

  timeout = setTimeout(()=>
  {

    // As long as there are still hosts connected, we run autodraft.
    if(hosts.length != 0)
      hosts[turn].emit('autodraft');

  }, MAXTIME);

}

// Triggered by 'passturn' event: Resets the 15 second timer.
function resetTimeout() 
{
  if(typeof timeout === 'object')
  {

    console.log("Timeout has been reset.");
    clearTimeout(timeout);

  }
}

/* When a host connects to the server, push the socket ID onto the hosts array. */
io.on('connection', function(socket)
{

  // Push new connecting users onto array with socket ID's.
  hosts.push(socket);

  if(hosts.length == 1)
  {
    nextTurn();
  }

  // Shows us a player connected and how many are now connected.
  console.log("A player connected.");
  console.log("Number of players now: ", hosts.length);

  // When the pass_turn event is triggered.
  socket.on('passturn', function()
  {

    console.log("Pass turn happened!");

    // If the user's socketID matches socket, reset timeout & trigger the next turn.
    if(hosts[turn] == socket)
    {

      console.log('Current host matches socket:' + socket);
      resetTimeout();
      nextTurn();

    }

  });

  // If a player closes the browser or refreshes, this will trigger.
  socket.on('disconnect', function()
  {

    // Display that a user disconnected.
    console.log('A player disconnected');

    // Take them out of the array and decrement turn.
    hosts.splice(hosts.indexOf(socket),1);
    turn--;

    // Display status message.
    console.log("Number of players now: ", hosts.length);

  });

})
