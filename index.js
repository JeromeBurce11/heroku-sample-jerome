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
  socket.on('logout',function(username){
    var index = 0;
    for (var i=0;i<users.length;++i) {
      if (username == users[i]) {
        index = i;
      }
    }
    console.log(index);
    users.splice(index, 1);
    io.emit('logout',users);
 })
});
app.use(express.static('public'));

http.listen(port, function () {
  console.log('listening on *:' + port);
});
