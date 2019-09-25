var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var express = require('express');
var users = []

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

  socket.on('typing', function (typing) {
    //io.emit('typing');
    socket.broadcast.emit('typing', typing)

  })

  socket.on('online', function (names) {
    if (!users.includes(names)) {
      users.push(names);
      io.emit("online", users)
     // console.log(users)
    } else {
      io.emit("already_used", names+" already used");
    }
  });
  socket.on('disconnect',function(data){
    var i = users.indexOf(data);
    users.splice(i,1);
    io.emit('online',users);
 })
});
app.use(express.static('public'));

http.listen(port, function () {
  console.log('listening on *:' + port);
});
