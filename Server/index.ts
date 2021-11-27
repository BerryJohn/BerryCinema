import {Server} from 'socket.io';

interface IRoom{
    name: string;
    users: number;
}

const roomList: IRoom[] = [];
roomList.push({
    name: 'dupa',
    users: 2
});

const io = new Server(3001,{
    cors:{
        origin: ['http://localhost:3000']
    }
});

io.on('connection', (socket) =>{
    console.log(socket.id);
    socket.on('share-rooms',() =>{
        io.emit('recive-rooms', roomList);
    });
});
