const app = require('express')();
const serverJs = require('http').createServer(app);
const io = require('socket.io')(serverJs);
const bodyParser = require('body-parser');
const url = require("url");
const PORT = process.env.YOUR_PORT || process.env.PORT || 4200;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let clientResponseRef;
app.get('/*', (req, res) => {
    let pathname = url.parse(req.url).pathname;

    let obj = {
        pathname: pathname,
        method: "get",
        params: req.query
    }

    io.emit("page-request", obj);
    clientResponseRef = res;
})

app.post('/*', (req, res) => {
    let pathname = url.parse(req.url).pathname;

    let obj = {
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

serverJs.listen(server_port, () => {
    console.log(`Server listening on ${PORT}`);
})
