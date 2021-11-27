import {Server} from 'socket.io';

interface IVideo{
    link: string;
    startedAt: string;
}

const io = new Server(3001,{
    cors:{
        origin: ['http://localhost:3000']
    }
});

let videoArr: IVideo[] = [];
//Current video share
io.on('connection', (socket) =>{
    io.emit('current-videos', videoArr);

    socket.on('add-video',(link: string) => {
        videoArr.push({
            link: link,
            startedAt: `${Date.now()}`
        });
        io.emit('current-videos', videoArr); 
    })
});