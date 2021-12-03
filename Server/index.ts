import {Server, Socket} from 'socket.io';

interface IVideo{
    link: string;
    startedAt: string;
    duration: number;
    currentTime: number;
    thumbnail: string;
    title: string;
    description: string;
}

const io = new Server(3001,{
    cors:{
        origin: ['http://localhost:3000','http://192.168.2.217:3000'],
    }
});

let videoArr: IVideo[] = [];

const getCurrentVideo = () => videoArr.length > 0 ? videoArr[0] : null;
//Current video share
io.on('connection', (socket) =>{
    io.emit('current-videos', videoArr);

    socket.on('add-video',(newVideo: IVideo) => {
        if(newVideo.duration != -1 || newVideo.duration !== null)
        {
            videoArr.push({
                link: newVideo.link,
                startedAt: `${Date.now()}`,
                duration: newVideo.duration,
                currentTime: 0,
                thumbnail: newVideo.thumbnail,
                title: newVideo.title,
                description: newVideo.description
            });
            io.emit('current-videos', videoArr);
            if(videoArr.length <= 1)
                startVideoInterval();
        }
    });
    socket.on('play-video', () => {
        socket.emit('current-video-data', getCurrentVideo());
    });
});

let videoInterval: NodeJS.Timeout;

const startVideoInterval = () => {
    if(videoArr.length > 0)
        videoInterval = setInterval(() => videoPlayerInterval(videoArr[0]), 1000);
}
const stopVideoInterval = () => {
    clearInterval(videoInterval);
}
const videoPlayerInterval = (video: IVideo) => {
    if(video.currentTime >= video.duration)
    {
        stopVideoInterval();
        videoArr.shift();
        io.emit('current-videos', videoArr);
        if(videoArr.length > 0)
            {
                startVideoInterval();
                io.emit('current-video-data', getCurrentVideo());                    
            }
        return;
    }
    video.currentTime += 1;
};