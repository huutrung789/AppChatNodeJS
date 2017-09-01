var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const  socketIO = require('socket.io');
const http = require('http');
var {locationMessage} = require('./public/javascripts/libs/message');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


var port = process.env.PORT || 3000;


var publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


io.on('connection', function (socket) {
    console.log('New User connected');

    //Emit single connection
    socket.emit('newMessage', {from: 'Admin', text: 'Welcome to chat app'});

    socket.on('createMessage', function (data, callback) {
       console.log('Create Message: ', data);

       //Broadcast event
       // io.emit('createEmail', data);
        socket.emit('newMessage', data);
       socket.broadcast.emit('newMessage', data);

        callback('Thank you');
    });

    socket.on('sendLocationMessage', function (message) {
       io.emit('sendLocationMessage', locationMessage(message.longitude, message.latitude));
    });

    socket.on('disconnect', function (data) {
        console.log('User disconnected');
    });
});

//My code
server.listen(port, (req, res) => {
    console.log('Server has started on port: ', port);
});
// module.exports = app;
