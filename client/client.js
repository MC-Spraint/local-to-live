var socketServerUrl = "http://localhost:3000";
var hostToLive = "http://localhost:4200";

var client = require("socket.io-client")(socketServerUrl);
const { SSL_OP_NO_TICKETS } = require("constants");
const superagent = require("superagent");

function executeGet(url,params){
        superagent.get(url)
        .query(params)
        .end((err,res) =>{
                if(err){ console.log(err); }
                else{
                client.emit("page-response", res.text);
                }
        })
}

function executePost(url,params){
        superagent.post(url)
        .query(params)
        .end((err,res) =>{
                if(err){ console.log(err); }
                else{
                client.emit("page-response", res.text);
                }
        })
}

client.on("connect", ()=>{
        console.log("Connected")
});

client.on("disconnect", ()=>{
        console.log("disconnected")
});
client.on("page-request", (io)=>{
	let path = io.pathname;
	let method = io.method;
	let params = io.params;

	let localhostUrl = hostToLive + path;

if(method === "get")executeGet(localhostUrl,params)
else if(method === "post")executePost(localhostUrl,params)
})


