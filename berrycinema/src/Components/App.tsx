import { io } from 'socket.io-client';

import React, {FC, useEffect, useState} from 'react';
import './App.scss';
import MiniRoom from './MiniRoom/MiniRoom';
 
const socket = io('http://localhost:3001');

interface IRoom{
    name: string;
    users: number;
}

socket.emit('share-rooms');

const App:FC = () => {
    const [rooms, setRooms] = useState<IRoom[]>([])

    useEffect(() => {
        socket.on('recive-rooms', (roomList: any[]) =>{
            // console.log('xD')
            console.log(roomList);
            setRooms(roomList);
        });
    }, [rooms]);

    return (
        <div className="main">
            ${rooms.map( (el) => (//change key
                <MiniRoom key={el.name} name={el.name} users={el.users}></MiniRoom>
            ))}
        </div>
    );
}
 
export default App;