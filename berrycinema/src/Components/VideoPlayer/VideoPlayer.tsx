import React, {FC, useEffect, useState} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { IVideo, socket } from '../App';
import './VideoPlayer.scss';
import VideoReactPlayer from './VideoReactPlayer';

interface IVideoPlayerProps {

}
 
const VideoPlayer: FC<IVideoPlayerProps> = (props) => {

    const [video, setVideo] = useState<IVideo>();

    useEffect(() => {
        socket.on('user-change-video', (currentVideo: IVideo) => {
            setVideo(currentVideo);
        });
        socket.on('end-of-queue', () => {
            setVideo(undefined);
        });
    },[video]);
    
    const fcHandle = useFullScreenHandle();

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