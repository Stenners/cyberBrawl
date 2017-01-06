var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1337);

var playersArr = [];
const speed = 3;

function createPlayers(socket) {
    var data = {
        id: socket.id,
        //posX: Math.floor(Math.random() * 500),
        //posY: Math.floor(Math.random() * 500)
    };
    playersArr.push(data);
    console.log(data.id + ' joined');
    // socket.broadcast.emit('joined', playersArr, socket.id);
    // socket.emit('joined', playersArr, socket.id);
	io.sockets.emit('joined', playersArr, socket.id);
}

io.on('connection', function(socket) {

    createPlayers(socket);

    // socket.on('right', function() {
    //     var elementPos = playersArr.map(function(x) { return x.id; }).indexOf(socket.id);
    //     playersArr[elementPos].posX += speed;
    //     io.sockets.emit('moved', playersArr, socket.id, 'right');
    // });
    // socket.on('left', function() {
    //     var elementPos = playersArr.map(function(x) { return x.id; }).indexOf(socket.id);
    //     playersArr[elementPos].posX -= speed;
    //     io.sockets.emit('moved', playersArr, socket.id, 'left');
    // });
    // socket.on('up', function() {
    //     var elementPos = playersArr.map(function(x) { return x.id; }).indexOf(socket.id);
    //     playersArr[elementPos].posY -= speed*0.8;
    //     io.sockets.emit('moved', playersArr, socket.id, 'up');
    // });
    // socket.on('down', function() {
    //     var elementPos = playersArr.map(function(x) { return x.id; }).indexOf(socket.id);
    //     playersArr[elementPos].posY += speed*0.8;
    //     io.sockets.emit('moved', playersArr, socket.id, 'down');
    // });

	socket.on('playerInfo', function(position) {
        console.log(position);
		var elementPos = playersArr.map(function(x) { return x.id; }).indexOf(socket.id);
	    playersArr[elementPos].position = position;
		io.sockets.emit('moved', playersArr, socket.id);
    });

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        var i = playersArr.indexOf(socket.id);
        playersArr.splice(i, 1);
        console.log(playersArr);
        //socket.broadcast.emit('dropped', playersArr, socket.id);
		io.sockets.emit('dropped', playersArr, socket.id);
    });


});
