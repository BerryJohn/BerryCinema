import {Server} from 'socket.io';
import { IVideo, videos } from './videos';



//Server init
const io = new Server(3001,{
    cors:{
        origin: ['http://localhost:3000','http://192.168.2.217:3000'],
    }
});
//classes
const videosArr = new videos;

//Server interval videoplayer
let intervalStatus: boolean = false;
let videoplayerInterval: NodeJS.Timeout;

const videoplayerIntervalHandler = (video: IVideo) => {
    if(video.currentTime >= video.duration)
    {
        stopVideoInterval();
        videosArr.shiftVideo();
        //announce end of video, and send refresed queue
        io.emit('current-video-array', videosArr.showVideos())        
        //if there is another video, play it and announce
        if(videosArr.countVideos() > 0)
        {
            //queue autoplay
            startVideoInterval();
            io.emit('user-change-video', videosArr.currentVideo())
            io.emit('current-video-array', videosArr.showVideos())
        }
        return;
    }
    //else  count time
    console.log(video.currentTime);
    video.currentTime += 1;
}

const startVideoInterval = () => {
    if(videosArr.countVideos() > 0)
        {
            const currentVideo = videosArr.currentVideo();
            if(currentVideo)
            {
                videoplayerInterval = setInterval(() => videoplayerIntervalHandler(currentVideo), 1000);
                intervalStatus = true;
            }
        }
}

const stopVideoInterval = () => {
        clearInterval(videoplayerInterval);
        intervalStatus = false;
}

/////////////////////////////
const videoStopHandler = () => {
    console.log('stop');
    if(videosArr.countVideos() > 0)
    {
        const currentVideo = videosArr.currentVideo();
        if(currentVideo === null)
            return;

        stopVideoInterval();
        currentVideo.playing = false;
        io.emit('server-video-stop', currentVideo);
    }
}

const videoStartHandler = () => {
    console.log('start');
    if(videosArr.countVideos() > 0 && !intervalStatus)
        {
            const currentVideo = videosArr.currentVideo();
            if(currentVideo === null)
                return;    
            currentVideo.playing = true;
            startVideoInterval();
            io.emit('server-video-start', currentVideo);
        }

}

//sockets
//user connection
io.on('connection', socket => {
    //When user is connecting, share current queue to him
    socket.emit('current-video-array', videosArr.showVideos());
    if(videosArr.countVideos() > 0)
        io.emit('user-change-video', videosArr.currentVideo())
    ////

    socket.on('user-add-video', (video: IVideo) => {
        if(video.duration > 0)
            {
                video.currentTime = 0;
                video.playing = true;
                videosArr.addVideo(video);
                if(videosArr.countVideos() <= 1)
                {   
                    //emit that video is running
                    io.emit('user-change-video', videosArr.currentVideo());
                    startVideoInterval();
                }
            }
        if(videosArr.countVideos() > 0)
            io.emit('current-video-array', videosArr.showVideos()) //when user adds video announce new queue
    });

    socket.on('get-current-video-data', () => {
        socket.emit('current-video-data', videosArr.currentVideo())
    });

    socket.on('server-video-stop',() => {
        if(videosArr.currentVideo()?.playing)
            videoStopHandler();
    });
    socket.on('server-video-start',() => {
        if(!videosArr.currentVideo()?.playing)
            videoStartHandler();
    });

    // console.log(Object.keys(io.engine.clients))
});


