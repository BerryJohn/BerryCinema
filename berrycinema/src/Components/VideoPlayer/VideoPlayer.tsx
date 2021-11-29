import React, {FC, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io-client';
import { IVideo } from '../App';

interface VideoPlayerProps {
    currentVideo: IVideo;
    socket: Socket;
}
 
const VideoPlayer: FC<VideoPlayerProps> = (props) => {
    const socket = props.socket;

    const [currentVideo, setVideo] = useState('');
    const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
    const bigPlayer = useRef<ReactPlayer>(null);

    const videoPlayingHandler = () => setVideoPlaying(!videoPlaying);
    const onPlayHandler = () => {  // repair
        socket.emit('play-video');
        socket.on('current-video-data', (video: IVideo) => {
            const newTime: number = video?.currentTime || 0; 
            bigPlayer.current?.seekTo(newTime);
            if(videoPlaying == false)
                videoPlayingHandler();
        });
    };
    return (
        <>
            <ReactPlayer
                controls={true}
                playing={videoPlaying}
                ref={bigPlayer}
                url={props.currentVideo?.link}
                onReady={() => onPlayHandler()}
                // onBufferEnd={() => videoPlayingHandler()}
            />
            <button onClick={() => onPlayHandler()}>seek to</button>
            <button onClick={() => videoPlayingHandler()}>{`${videoPlaying}`}</button>

        </>
    );
}
 
export default VideoPlayer;