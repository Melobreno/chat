const { WebSocketServer } = require('ws');
const dotenv = require('dotenv')

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

//Caso o servidor reconheça que uma mensagem foi enviada notifica os usuários
wss.on('connection', (ws)=> {
    ws.on('error', console.error)

    ws.on('message', (data)=>{        
        console.log(data.toString())
        wss.clients.forEach((client)=> client.send(data.toString()))
    })

    console.log("Client Connected")
})
