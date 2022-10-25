import { Server } from "socket.io"
import { Server as HttpServer } from 'http';
import { LocationObject } from './types';
import { handleNewLocationObject } from "./brains";

let io: Server

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: { origin: 'http://localhost:3000' }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('newLocationObject', (locationObject: LocationObject) => {
            handleNewLocationObject(locationObject);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    setInterval(() => {
        const newObj = {
            lat: 27 + Math.random(),
            lng: 80 + Math.random(),
            phone: '123',
            timestamp: Date.now()
        }
        sendLocationObject(newObj)
    }, 10000)
}

export const sendLocationObject = (data: LocationObject) => {
    io.emit('newPosition', data)
}

export const sendSocketMessage = (message: string) => {
    io.emit('message', message);
}
