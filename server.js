var app = require('express')();
var serverJs = require('http').createServer(app);
var io = require('socket.io')(serverJs);
var url = require("url");
var bodyParser = require('body-parser');

app.use(bodyParser());

var clientResponseRef;
app.get('/*', (req, res) => {
    var pathname = url.parse(req.url).pathname;

    var obj = {
        pathname: pathname,
        method: "get",
        params: req.query
    }

    io.emit("page-request", obj);
    clientResponseRef = res;
})

app.post('/*', (req, res) => {
    var pathname = url.parse(req.url).pathname;

    var obj = {
        pathname: pathname,
        method: "post",
        params: req.body
    }

    io.emit("page-request", obj);
    clientResponseRef = res;
})

io.on('connection', (client) => {
    console.log('a node connected');
    client.on("page-response", (res) => {
        clientResponseRef.send(res);
    })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;

serverJs.listen(server_port, () => {
    console.log('listening on *:' + server_port);
})
