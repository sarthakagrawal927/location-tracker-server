import { Server as HttpServer } from 'http';
import { Server } from "socket.io";
import { handleLocations, handleNewLocationObject } from "./brains";
import { LocationObject } from './types';
import { receiveLocationTimer, storeLocationInDBTimer } from './constants';

let io: Server
let activeSocket: string

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: { origin: process.env.WEB_URL }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('newLocationObject', (locationObject: LocationObject) => {
            handleNewLocationObject(locationObject);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('subscribe', (phone: string) => {
            activeSocket = phone;
        })
    });

    setInterval(() => {
        const newObj = {
            lat: 26.8467 + Math.random(),
            lng: 80.9462 + Math.random(),
            phone: activeSocket || Math.floor(Math.random() * 3) + "",
            timestamp: Date.now()
        }
        handleNewLocationObject(newObj)
    }, receiveLocationTimer / (process.env.MODE === "DEV" ? 20 : 1))

    setInterval(() => {
        handleLocations();
    }, storeLocationInDBTimer / (process.env.MODE === "DEV" ? 20 : 1))
}

export const sendLocationObject = (data: LocationObject) => {
    io.emit('newPosition', data)
}

export const sendSocketMessage = (message: string) => {
    io.emit('message', message);
}
