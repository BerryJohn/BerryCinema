import React, {FC, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io-client';
import { IVideo } from '../App';
import './videoPlayer.scss';

interface VideoPlayerProps {
    currentVideo: IVideo;
    socket: Socket;
}
 
const VideoPlayer: FC<VideoPlayerProps> = (props) => {
    const socket = props.socket;

    const [isSmallBar, setIsSmallBar] = useState<boolean>(true);
    const [currentPlayed, setCurrentPlayed] = useState<number>(0);
    const [currentLoaded, setCurrentLoaded] = useState<number>(0);
    const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
    const bigPlayer = useRef<ReactPlayer>(null);
    const smallTimeBarRef = useRef<HTMLDivElement>(null);
    const bigTimeBarRef = useRef<HTMLDivElement>(null);

    const videoPlayingHandler = () => {
        setVideoPlaying(!videoPlaying)
        socket.emit('play-video');
        socket.on('current-video-data', (video: IVideo) => {
            const newTime: number = video?.currentTime || 0; 
            bigPlayer.current?.seekTo(newTime);
        });
    };

    const currentPlayedHandler = (e:any) => setCurrentPlayed(e.played);
    const currentLoadedHandler = (e:any) => setCurrentLoaded(e.loaded);
    const onMouseMoveHandler = () => setIsSmallBar(false);
    const onMouseMoveLeave = () => setIsSmallBar(true);

    return (
        <div className='videoContainer'>
            <ReactPlayer
                className='reactVideo'
                width='100%'
                height='100vh'
                controls={false}
                playing={videoPlaying}
                ref={bigPlayer}
                url={props.currentVideo?.link}
                
                onProgress={(e) => {currentPlayedHandler(e);currentLoadedHandler(e)}}
            />
            <div className='playerControls' 
                onMouseUp={() => videoPlayingHandler()} 
                onMouseOver={() => {onMouseMoveHandler()}}
                onMouseLeave={() => {onMouseMoveLeave()}}

            >

                <div className={isSmallBar ? 'smallTimeBar' : 'smallTimeBar smallBarHidden'} ref={smallTimeBarRef}>
                    <div className='loadedTimeBar' style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * currentLoaded}px`}}>
                        <div className="currentTimeBar" style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * currentPlayed}px`}} />
                    </div>
                </div>
                
                <div className={!isSmallBar ? 'controlPanel' : 'controlPanel controlPanelHidden'}>
                    <div className='bigTimeBar' ref={bigTimeBarRef}>
                        <div className='loadedTimeBar' style={{width:`${(bigTimeBarRef.current?.offsetWidth || 0) * currentLoaded}px`}}>
                            <div className="currentTimeBar" style={{width:`${(bigTimeBarRef.current?.offsetWidth || 0) * currentPlayed}px`}} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
 
export default VideoPlayer;