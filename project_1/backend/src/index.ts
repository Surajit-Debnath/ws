import {WebSocketServer,WebSocket} from 'ws';
const wss = new WebSocketServer({port:8080});


let userConnect =0;
interface User{
  socket:WebSocket,
  room:string
}
let allSockets:User[]=[];



wss.on("connection",(socket)=>{

   userConnect+=1;
   console.log("user connected:"+userConnect);


   socket.on("message",(message)=>{
      const parseMessage=JSON.parse(message as unknown as string);
      if(parseMessage.type==="join"){
        allSockets.push({
          socket,
          room:parseMessage.payload.roomId
        })
      }

      if(parseMessage.type==="chat"){
        const currentUserroom=allSockets.find(x=>x.socket==socket);
        if(!currentUserroom){
          return;
        }
        allSockets.map((x)=>{
          if(x.room==currentUserroom.room){
            x.socket.send(parseMessage.payload.message+"from server")
          }
        })
      }

   })
   
 
});

