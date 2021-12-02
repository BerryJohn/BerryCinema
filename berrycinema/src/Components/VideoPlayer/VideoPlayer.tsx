import React, {FC, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io-client';
import { IVideo } from '../App';
import './videoPlayer.scss';

import { BiPlay, BiPause, BiVolumeLow } from "react-icons/bi";

interface VideoPlayerProps {
    currentVideo: IVideo;
    socket: Socket;
}
 
const VideoPlayer: FC<VideoPlayerProps> = (props) => {
    const socket = props.socket;

    const [isSmallBar, setIsSmallBar] = useState<boolean>(true);
    const [currentPlayedSeconds, setCurrentPlayedSeconds] = useState<number>(0);
    const [currentPlayed, setCurrentPlayed] = useState<number>(0);
    const [currentLoaded, setCurrentLoaded] = useState<number>(0);
    const [videoVolume, setVideoVolume] = useState<number>(0);
    const [videoPlaying, setVideoPlaying] = useState<boolean>(false);

    const bigPlayer = useRef<ReactPlayer>(null);
    const smallTimeBarRef = useRef<HTMLDivElement>(null);
    const bigTimeBarRef = useRef<HTMLDivElement>(null);
    const playerControlsRef = useRef<HTMLDivElement>(null);
    const statusButtonRef = useRef<HTMLDivElement>(null);

    const videoPlayingHandler = () => {
            setVideoPlaying(!videoPlaying)
            socket.emit('play-video');
            socket.on('current-video-data', (video: IVideo) => {
                const newTime: number = video?.currentTime || 0; 
                bigPlayer.current?.seekTo(newTime);
            }); 
    };

    const playerControlsHandler = (e: any) => {
        if(playerControlsRef.current === e.target)
            videoPlayingHandler();
    };

    const statusButtonHandler = () => {
        videoPlayingHandler();
    }

    const onProgressHandler = (e:any) => {
        setCurrentPlayed(e.played)
        setCurrentLoaded(e.loaded)
        setCurrentPlayedSeconds(e.playedSeconds)
    };
    const onMouseMoveHandler = () => setIsSmallBar(false);
    const onMouseMoveLeave = () => setIsSmallBar(true);

    const inputVolumeHandler = (volume: number) => {
        setVideoVolume(volume/100);
    };

    return (
        <div className='videoContainer'>
            <ReactPlayer
                className='reactVideo'
                width='100%'
                height='100vh'
                volume={videoVolume}
                controls={false}
                playing={videoPlaying}
                ref={bigPlayer}
                url={props.currentVideo?.link}
                onProgress={(e) => {onProgressHandler(e)}}
            />
            <div className='playerControls' 
                onMouseUp={(e) => playerControlsHandler(e)} 
                onMouseOver={() => {onMouseMoveHandler()}}
                onMouseLeave={() => {onMouseMoveLeave()}}
                ref={playerControlsRef}
            >

                <div className={isSmallBar ? 'smallTimeBar' : 'smallTimeBar smallBarHidden'} ref={smallTimeBarRef}>
                    <div className='loadedTimeBar' style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * currentLoaded}px`}}>
                        <div className="currentTimeBar" style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * currentPlayed}px`}} />
                    </div>
                </div>
                
                <div className={!isSmallBar ? 'controlPanel' : 'controlPanel controlPanelHidden'}>
                    <div className='statusButton' onClick={statusButtonHandler}>
                        {videoPlaying ? (<BiPause className='statusPlay'/>) : <BiPlay className='statusPlay'/>}
                    </div>
                    <div className="currentTimer">{new Date(currentPlayedSeconds * 1000).toISOString().substr(11, 8)}</div>
                    <div className='bigTimeBar' ref={bigTimeBarRef}>
                        <div className='loadedTimeBar' style={{width:`${(bigTimeBarRef.current?.offsetWidth || 0) * currentLoaded}px`}}>
                            <div className="currentTimeBar" style={{width:`${(bigTimeBarRef.current?.offsetWidth || 0) * currentPlayed}px`}}>
                                <div className="marker"/>
                            </div>
                        </div>
                    </div>
                    <div className="currentTimer">{new Date((bigPlayer.current?.getDuration() || 0) * 1000).toISOString().substr(11, 8)}</div>
                    <div className="volumeSlider">
                        <div className="volume">
                            <BiVolumeLow className='volumeIcon' />
                        </div>
                        <div className="slider">
                            <input type='range' max='100' min='0' onChange={(e) => inputVolumeHandler((parseInt(e.target.value)))}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
 
export default VideoPlayer;