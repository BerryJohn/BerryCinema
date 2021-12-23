import {Server, Socket} from 'socket.io';

interface IVideo{
    link: string;
    startedAt: string;
    duration: number;
    currentTime: number;
    thumbnail: string;
    title: string;
    description: string;
    playing: boolean;
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
                description: newVideo.description,
                playing: true, 
            });
            io.emit('current-videos', videoArr);
            if(videoArr.length <= 1)
                startVideoInterval();
        }
    });
    socket.on('play-video', () => {
        socket.emit('play-video-data', getCurrentVideo());
    });
    socket.on('get-current-video-data', () => {
        socket.emit('current-video-data', getCurrentVideo());
    });
    socket.on('server-video-stop',() => {
        if(getCurrentVideo()?.playing)
            videoStopHandler();
    });
    socket.on('server-video-start',() => {
        if(!getCurrentVideo()?.playing)
            videoStartHandler();
    });
});

let videoIntervalStatus: boolean = false;
let videoInterval: NodeJS.Timeout;

const startVideoInterval = () => {
    if(videoArr.length > 0)
        {
            videoInterval = setInterval(() => videoPlayerInterval(videoArr[0]), 1000);
            videoIntervalStatus = true;
        }
};

const stopVideoInterval = () => {
    clearInterval(videoInterval);
    videoIntervalStatus = false;
};

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
    console.log(video.currentTime);
    video.currentTime += 1;
};

const videoStopHandler = () => {
    if(videoArr.length > 0)
    {
        console.log('stop');
        stopVideoInterval();
        videoArr[0].playing = false;
        io.emit('server-video-stop', videoArr[0]);
    }
}

const videoStartHandler = () => {
    if(videoArr.length > 0 && !videoIntervalStatus)
        {
            console.log('start');
            videoArr[0].playing = true;
            startVideoInterval();
            io.emit('server-video-start', videoArr[0]);
        }
}