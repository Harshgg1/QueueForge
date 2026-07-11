import {Server} from "socket.io";
import http from "http";

let io: Server;

export function initSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:4000",
                "http://localhost:3000",
                ],
            credentials: true,
        },
    });
    io.on("connection", (socket) =>{
        console.log("Client Connected:", socket.id);

        socket.on("join", (userId: string) => {
            socket.join(userId);
            console.log(`${socket.id} joined room ${userId}`);
        })

        socket.on("disconnect", ()=>{
            console.log("client disconnected:", socket.id);
        })
    })
    

    
    return io;
}

export function getIO() {
    if(!io) {
        throw new Error("Socker.io not initilaized")
    }
    return io;
}