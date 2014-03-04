var express = require("express"),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = {},
	usersArr = new Array(),
	music =  new Array(),
	currIdx = 1,
	currPlayHead=0,
	currDJ = null,
	topic="MERRY CHRISTMAS";
	topicCreator = "";
	fbHiScore = "10";
	fbHiScoreName="SERVER";
	
server.listen(3000);

app.get('/', function(req, res){
	res.sendfile(__dirname + "/xmas_index.html");
});
app.get('/fonts/:name', function(req, res){
	res.sendfile(__dirname + "/fonts/" + req.params.name);
});
app.get('/maincss', function(req, res){
	res.sendfile(__dirname + "/main_xmas.css");
});
app.get('/jpcss', function(req, res){
	res.sendfile(__dirname + "/css/jplayer.xmas.css");
});
app.get('/css', function(req, res){
	res.sendfile(__dirname + "/bootstrap/css/bootstrap.css");
});
app.get('/js', function(req, res){
	res.sendfile(__dirname + "/bootstrap/js/bootstrap.min.js");
});
app.get('/jssnow', function(req, res){
	res.sendfile(__dirname + "/js/snow/snowstorm.js");
});
app.get('/jquery', function(req, res){
	res.sendfile(__dirname + "/jquery-1.9.1.js");
});
app.get('/trebjs', function(req, res){
	res.sendfile(__dirname + "/treb.js");
});
app.get('/images/:name', function(req, res){
	res.sendfile(__dirname + "/images/" + req.params.name);
});	
app.get('/images/:foldername/:name', function(req, res){
	res.sendfile(__dirname + "/images/" + req.params.foldername + "/" + req.params.name);
});	
app.get('/images/:foldername/:foldername2/:name', function(req, res){
	res.sendfile(__dirname + "/images/" + req.params.foldername + "/"+ req.params.foldername2 + "/"  + req.params.name);
});	
app.get('/audio/:name', function(req, res){
	res.sendfile(__dirname + "/audio/" + req.params.name);
});	
app.get('/audio/:foldername/:name', function(req, res){
	res.sendfile(__dirname + "/audio/" + req.params.foldername + "/" + req.params.name);
});	

app.get('/flappybird', function(req, res){
	res.sendfile(__dirname + "/flappybird/");
});	
app.get('/flappybirdcss', function(req, res){
	res.sendfile(__dirname + "/flappybird/flappybird.css");
});	
app.get('/flappybirdjs', function(req, res){
	res.sendfile(__dirname + "/flappybird/flappybird.js");
});	
app.get('/flappybirdshare', function(req, res){
	res.sendfile(__dirname + "/flappybird/flappyshare.js");
});	

app.get('sounds/', function(req, res){
	res.sendfile(__dirname + "/flappybird/sounds/");
});

app.get('/jplayerlist', function(req, res){
	res.sendfile(__dirname + "/js/jplayer/jplayer.playlist.min.js");
});
app.get('/jplayer', function(req, res){
	res.sendfile(__dirname + "/js/jplayer/jquery.jplayer.min.js");
});

io.sockets.on('connection', function(socket){
	socket.on('new user', function(data, callback){
		if(data in users){
			callback(false,data);
		} else if(/^[a-zA-Z0-9]*$/.test(data) == false) {
			callback(false,data);
		} else if(data == "") {
			callback(false,data);
		}else {
			callback(true);
			socket.stat = "available";
			socket.nickname = data;
			usersArr.push(data);
			users[socket.nickname] = socket;
			updateNicknames();
			systemLog(1);
			
			if(Object.keys(users).length==1){
				currDJ = socket.nickname;
				users[socket.nickname].emit('yourtheboss');
			}
			users[socket.nickname].emit('update list', {music: music,idx:currIdx,ph:currPlayHead});
			topicCreator= topicCreator==""?"[SERVER]":topicCreator;
			users[socket.nickname].emit('new topic', {msg: topic, nick: "<b>"+topicCreator+"</b>"});
			var servermsg = "<br/><b style='color:#FF0000'>[SERVER]</b>: <b>-=NEW FEATURES=-</b><br/>"+
			"/image [PATH]<br/>"+
			"/sound [PATH]<br/>"+
			"Christmas Theme with snow function (on|off)";
			users[socket.nickname].emit('server message', { msg: servermsg});
		}
	});

	function systemLog(flag){
		if(flag==1){//,cnt:Object.keys(users).length
			io.sockets.emit('enters chatroom', {nick: socket.nickname});
		}
		else {
			io.sockets.emit('exits chatroom', {nick: socket.nickname});
		}
	}

	function updateNicknames(){
		var usr= Object.keys(users).join(",");
		var stats = new Array();
		var tempArr = new Array();
		var i;
		for(i=0; i < usersArr.length;i++){
			if (usersArr[i])
				tempArr.push(usersArr[i])
		}
		usersArr = tempArr;
		
		for(i=0; i < usersArr.length;i++){
			if (users[usersArr[i]])
				stats.push(users[usersArr[i]].stat);
		}
		io.sockets.emit('usernames', Object.keys(users),stats);
	}

	socket.on('idle', function(data, callback){
		socket.stat = "away";
		io.sockets.emit('update idle', {nick: socket.nickname, stat: socket.stat});
	});
	socket.on('available', function(data, callback){
		socket.stat = "available";
		io.sockets.emit('update available', {nick: socket.nickname, stat: socket.stat});
	});

	socket.on('send message', function(data, callback){
		var msg = data.trim();
		if(msg.substr(0,3) == '/w ' ){
			msg = msg.substr(3);
			var ind =  msg.indexOf(' ');
			if(ind !== -1){
				var name = msg.substring(0, ind);
				var msg = msg.substring(ind + 1);
				if(name in users){
					users[name].emit('whisper', {msg: msg, nick: socket.nickname});
					console.log('whisper!');
				} else {
					callback('Error! Enter a valid user.');
				}
			} else {
				callback('Error! Please enter a message for your whisper.');
			}
		} else if(msg.substr(0,7) == '/whois ' ){
			var name = msg.substr(7);
				if(name in users){;
					if(name == "dopors")
						callback('Client connected from: 192.168.169.15');
					else
						callback('Client connected from: ' + users[name].handshake.address.address);
				} else {
					callback('Error! Enter a valid user.');
				}
		} else if(msg.substr(0,6) == '/buzz ' ){
			var name = msg.substr(6);
			if(name in users){
				users[name].emit('buzz', {msg: msg, nick: socket.nickname});	
			} else {
				callback('Error! Enter a valid user.');
			}
				
		} else if(msg.substr(0,6) == '/next ' ){
			var pass = msg.substr(6);
			if(pass == 'password'){
				music.shift();
				io.sockets.emit('update music', {music: music});
			} 
				
		} else if(msg.substr(0,4) == '/me ' ){
			msg = msg.substr(4);
			io.sockets.emit('me message', {msg: msg, nick: socket.nickname});
		} else if(msg.substr(0,5) == '/list' ){
			callback(music.title.toString().split("/").pop());

		} else if(msg.substr(0,6) == '/nick ' ){
			msg = msg.substr(6);
			
			if(msg in users){
			callback('That username is already take! Try again.');
			} else if(/^[a-zA-Z0-9- ]*$/.test(msg) == false) {
				callback('Sorry, you can\'t use alphanumeric characters and spaces anymore');
			}else if(msg == "") {
				callback('Nickname is empty');
			}else if(msg.length > 15) {
				callback('Nickname is too long');
			}else {
				io.sockets.emit('change nick', {msg: msg, nick: socket.nickname});
				usersArr.splice(socket.nickname,1);
				delete users[socket.nickname];
				socket.stat = "available";
				socket.nickname = msg;
				usersArr.push(msg);
				users[socket.nickname] = socket;
				updateNicknames();
			} 
		} else if(msg.substr(0,7) == '/audio ' ){
			msg = msg.substr(7);
			var hasQue = false;
			var addNick = "";
			var addTitle = "";
			var n=msg.split("|");
			for (i=0; i < music.length; i++){
				//if (music[i].mp3 == decodeURI(n[0])){
				var newQue = decodeURI(n[0]);
				//newQue = newQue.substr(0,newQue.length-5);
				if (music[i].mp3==newQue){//.indexOf(newQue) == -1){
					hasQue = true;
					addTitle = music[i].title;
					addNick = music[i].artist;
					break;
				}
			}

				if(hasQue==false && n[1]!="true"){
					users[socket.nickname].emit('queue now', {path: decodeURI(n[0]),nick: socket.nickname});
					users[socket.nickname].emit('new audio', {msg: msg, nick: socket.nickname, music: music});
				} else if (n[1]=="true"){
					users[socket.nickname].emit('new audio', {msg: msg, nick: socket.nickname, music: music});
				}else if (users[socket.nickname])
					users[socket.nickname].emit('audio exist',{msg:'<b> "'+addTitle+'" already in the list. Added by: <i style="color:#FF0000">'+addNick+'</i> </b><br/>',nick:'[SERVER]'});
				

			
			
		} else if(msg.substr(0,6) == '/sound' ){
			msg = msg.substr(7);
			users[socket.nickname].emit('new audio', {msg: msg+"|true", nick: socket.nickname});
			
		} else if(msg.substr(0,7) == '/topic ' ){
			msg = msg.substr(7);
			topicCreator = socket.nickname;
			topic = msg;
			
			io.sockets.emit('new topic', {msg: msg, nick: socket.nickname});
			
		} else if(msg.substr(0,5) == '/help' ){
			callback("/w |name| |msg| - to whisper</br>" +
					"/buzz |name| - to buzz! someone</br>" +
					"/me |msg| - to emphasize an action message.</br>" +
					"/nick |new nick| -changes your nickname</br>" +
					"/audio |path|</br>" +
					"/list - display list of music queued</br>" +
					"/topic |msg| - Set the topic for the current room");
			
		} else if(msg.substr(0,7) == '/player' ){
			var params = msg.substr(8).split(" ");
			switch(params[0]){
				case "next":
				case "prev":
					if (params[0] == "next")
						currIdx++;
					else
						currIdx--;
					currPlayHead=0;
					io.sockets.emit('player control',{nick:socket.nickname,type:params[0]});
				break;
				case "playAt":
					currIdx = params[1]-1;
					if (currIdx>0)
						io.sockets.emit('player control',{nick:socket.nickname,type:params[0],idx:params[1]});
					else if (currIdx > music.length-1 || currIdx < 1)
						users[socket.nickname].emit('player control',{nick:socket.nickname,type:params[0],idx:params[1],listCnt:music.length});
					
						
				break;
				case "play":
				case "pause":
				case "clear":
					io.sockets.emit('player control',{nick:socket.nickname,type:params[0]});
				break;
				case "current":
					users[currDJ].emit('player control',{nick:socket.nickname,type:params[0]});
				break;
			}
		}else if(msg.substr(0,3) == '/dj' ){
			var name = msg.substr(4);
			if(name in users){;
				io.sockets.emit('me message', {msg: ' : DJ '+name+' on the mix', nick: '[SERVER] '});
				currDJ = name;
				users[name].emit('yourtheboss');
			} else if (currDJ==null){
				callback('[SERVER] : WAY DJ. Palihug ko set.');
			}else
				callback('[SERVER] : DJ '+currDJ+' currently on the mix');
			
			
		}else if(msg.substr(0,7) == '/server' ){
			var command = msg.substr(8);
			switch(command){
				case "restart":
					io.sockets.emit('refresh', { msg: "<script>location.reload();</script>" });
				break;
			}
		}else if(msg.substr(0,6) == '/image' ){
			var src = msg.substr(7);
			io.sockets.emit('new image', {src: src, nick: socket.nickname});
		}else if (msg != ""){
			if (msg.indexOf('<audio ')==-1 || msg.indexOf('img src')==-1)
				io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
			else{
				var servermsg = "<b>[SERVER]</b> : Please use /sound [path] or /image [path]";
				users[socket.nickname].emit('server message', { msg: servermsg});
			}
		}
	});
	
	socket.on('buzz all', function(){
		io.sockets.emit('notify all');
	});
	socket.on('broadcast message', function(data){
		io.sockets.emit('display message',{message:data});
	});
	
	socket.on('set currentTime', function(data){
		currPlayHead = data;
	});

	socket.on('clear music', function(){
		music =  new Array();
		currIdx = 1;
		currPlayHead=0;
		users[socket.nickname].emit('clear playlist', {music: music,nick:socket.nickname});
	});

	socket.on('get song', function(index, callback){
		callback(music[index]);
	});
	
	socket.on('idle', function(data, callback){
		socket.stat = "away";
		io.sockets.emit('update idle', {nick: socket.nickname, stat: socket.stat});
	});

	socket.on('next song', function(){
		//music.shift();
		if(socket.nickname==currDJ){
			currIdx++;
			
			if (currIdx < music.length){
				currPlayHead = 0;
				currIdx = (currIdx-1)==-1?0:currIdx
				var servermsg = '[SERVER] : Next Song - <b>'+music[currIdx].title+'</b> <br/>added by :<i><u>'+music[currIdx].artist+'</u></i>';
				io.sockets.emit('server message', { msg: servermsg});
			}else if (currIdx == music.length){
				currIdx--;
			}
		}/*else{
			var servermsg = '[SERVER] : Next Song - <b>'+music[currIdx].title+'</b> <br/>added by :<i><u>'+music[currIdx].artist+'</u></i>';
			users[socket.nickname].emit('server message', { msg: servermsg});
		}*/
	});
	
	socket.on('update list', function(){
		io.sockets.emit('update list', {music: music});
	});
	
	socket.on('queue song', function(data){
		music.push(data);
		io.sockets.emit('update queue', {music: music,idx:currIdx});
	});

	socket.on('remove song', function(data){
		music.splice(data,1);

		io.sockets.emit('update queue', {music: music});
	})

	socket.on('send sound', function(data){
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
	});

	socket.on('send emoticon', function(data){
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		if (socket.nickname == currDJ){
			io.sockets.emit('me message', {msg: ' YOUR DJ LEFT YOU. Please assign a new DJ', nick: "[ SERVER ] :"});
			currDJ = null;
			currPlayHead=0;
		}
		usersArr.splice(socket.nickname,1);
		delete users[socket.nickname];
		updateNicknames();
		systemLog(2);
	});
	
});