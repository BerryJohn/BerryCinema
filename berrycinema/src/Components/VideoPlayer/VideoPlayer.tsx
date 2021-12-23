import React, {FC, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { IVideo, socket } from '../App';
import './videoPlayer.scss';
import VideoReactPlayer from './VideoReactPlayer';

interface VideoPlayerProps {
    currentVideo?: IVideo;
}
 
const VideoPlayer: FC<VideoPlayerProps> = (props) => {

    const [video, setVideo] = useState<IVideo>();

    useEffect(() => {
        socket.emit('play-video');
        socket.on('play-video-data', (currentVideo: IVideo) =>{
            setVideo(currentVideo);
        })
    },[]);
    
    const fcHandle = useFullScreenHandle();

    console.log('xD reload videoplayer')

    return (
        <div className='videoContainer'>
            <FullScreen handle={fcHandle}>
                <VideoReactPlayer 
                    currentVideo={video}
                    fullscreenHandler={fcHandle}
                />
            </FullScreen>
        </div>
    );
}
 
export default VideoPlayer;