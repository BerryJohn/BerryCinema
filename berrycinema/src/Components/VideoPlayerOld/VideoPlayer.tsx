import React, {FC, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { Socket } from 'socket.io-client';
import { IVideo } from '../App';
import './videoPlayer.scss';

import { BiPlay, BiPause, BiVolumeLow, BiVolumeFull, BiVolumeMute, BiVolume, BiFullscreen } from "react-icons/bi";

interface VideoPlayerProps {
    currentVideo: IVideo;
    socket: Socket;
}
let timer: NodeJS.Timeout;
 
const VideoPlayer: FC<VideoPlayerProps> = (props) => {
    const socket = props.socket;

    const handle = useFullScreenHandle();

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

    const videoPlayingHandler = () => {
            setVideoPlaying(!videoPlaying)
            videoServerSeek();
    };

    const videoServerSeek = () => {
        socket.emit('play-video');
        socket.on('current-video-data', (video: IVideo) => {
            const newTime: number = video?.currentTime || 0; 
            bigPlayer.current?.seekTo(newTime);
        });
    }

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

    const onMouseMoveHandler = () => {
        if(timer != null)
            clearTimeout(timer);

        timer = setTimeout(onMouseMoveLeave,2000);
        setIsSmallBar(false);
    };
    const onMouseMoveLeave = () => setIsSmallBar(true);

    const inputVolumeHandler = (volume: number) => {
        setVideoVolume(volume/100);
    };

    socket.on('server-video-stop',() => {
        setVideoPlaying(false);
    });

    socket.on('server-video-start',() => {
        setVideoPlaying(true);
        videoServerSeek();
    });

    return (
        <div className='videoContainer'>
            <FullScreen handle={handle}>
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
                <div className={videoPlaying ? 'playerControls' : 'playerControls playerControlsPaused'} 
                    onMouseUp={(e) => playerControlsHandler(e)} 
                    onMouseMove={() => {onMouseMoveHandler()}}
                    onMouseLeave={() => {onMouseMoveLeave()}}
                    ref={playerControlsRef}
                >

                    <div className={isSmallBar && videoPlaying ? 'smallTimeBar' : 'smallTimeBar smallBarHidden'} ref={smallTimeBarRef}>
                        <div className='loadedTimeBar' style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * currentLoaded}px`}}>
                            <div className="currentTimeBar" style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * currentPlayed}px`}} />
                        </div>
                    </div>
                    <div className={!videoPlaying ? 'videoStatus' : 'videoStatus videoStatusHidden'} onClick={statusButtonHandler}>
                        {!videoPlaying ? (<BiPlay className='statusIcon'/>) : (<BiPause className='statusIcon'/>)}
                    </div>
                    <div className={!isSmallBar || !videoPlaying ? 'title' : 'title titleHidden'}>{props.currentVideo?.title}</div>
                    <div className={!isSmallBar || !videoPlaying ? 'controlPanel' : 'controlPanel controlPanelHidden'}>
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
                                { videoVolume === 0 ? <BiVolumeMute className='volumeIcon'/> : 
                                videoVolume > 0.75 ? <BiVolumeFull className='volumeIcon'/> : 
                                videoVolume > 0.50 ? <BiVolumeLow className='volumeIcon'/> : 
                                <BiVolume className='volumeIcon' />  }
                            </div>
                            <div className="slider">
                                <input type='range' max='100' min='0' onChange={(e) => inputVolumeHandler((parseInt(e.target.value)))}/>
                            </div>
                        </div>
                        <div className="fullscreen" onClick={!handle.active ? handle.enter : handle.exit}>
                            <BiFullscreen className='fullscreenIcon'/>
                        </div>
                    </div>
                </div>
            </FullScreen>
        </div>
    );
}
 
export default VideoPlayer;