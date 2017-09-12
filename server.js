var express =require('express');
var  cors = require('cors');
var bodyParser=require('body-parser');
var passport =require('passport');
var mongoose=require('mongoose');
var path=require('path');
var config=require('./config/db');
var User=require('./models/utilisateur');
var db = require('./config/connection');


var app=express()
var users=require('./routes/users')
var declarations=require('./routes/declarations')
//port number
var port=3000;
//cors middleware
app.use(cors());
//ser static folder
//app.use(express.static(path.join(__dirname,'public')))
//app.use("/__admin", express.static(path.join(__dirname, 'admin')))
//body parser middleware
app.use('/admin', express.static('public/backend'));
app.use('/', express.static('public/frontend'));
app.use(bodyParser.json())
//passport Mid
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use('/users', users)
//index route
app.get('/',(req,res)=>{
	res.send('invalid')
})
users=[];
connections =[];
var server = require('http').createServer(app)
var io = require('socket.io')(server)
//socket io
io.sockets.on('connection',function(socket){
	connections.push(socket)
	console.log('connected: %s sockets connected',connections.length)
	// disconnect
	socket.on('disconnect',function(data){

	users.splice(users.indexOf(socket.username),1);
	updateUsernames();
	connections.splice(connections.indexOf(socket),1)
	console.log('disconnected:%s sockets connected',connections.length)
	})
	// send Message
	socket.on('send message',function(data){
		//console.log(data)
		io.sockets.emit('new message',{msg :data, user: socket.username});
	})
	// New user
	socket.on('new user',function(data,callback){

		console.log(data)
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	})
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
	})
function getIndexOfUser(userId){
	for (var i = 0; i < connectedUsers.length; i++) {
		if(connectedUsers[i].user_id == userId){
			return i
		}
	}
	return -1
}
function getIndexOfSocket(socketId){
	for (var i = 0; i < connectedUsers.length; i++) {
		if(connectedUsers[i].socket.id == socketId){
			return i
		}
	}
	return -1
}

function removeUser(userId){
	var index = getIndexOfUser(userId)
	if (index != -1) {
		connectedUsers.splice(index, 1)
	}
}

function removeSocket(socketId){
	var index = getIndexOfSocket(socketId)
	if (index != -1) {
		connectedUsers.splice(index, 1)
	}
}

function getSocketOfUser(userId){
	var index = getIndexOfUser(userId)
	if (index != -1) {
		return connectedUsers[index].socket
	}
	return null
}

//start server
server.listen(port,()=>{
console.log('server in port'+port)
})
