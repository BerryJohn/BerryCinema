import React, {FC, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { IVideo, socket } from '../App';
import VideoControls from './VideoControls';

import './videoPlayer.scss';

interface IVideoReactPlayer {
    currentVideo?: IVideo;
    fullscreenHandler: any;
}
 
const VideoReactPlayer: FC<IVideoReactPlayer> = (props) => {
    //refs
    const bigPlayer = useRef<ReactPlayer>(null);
    //video states
    const [videoPlayStatus, setVideoPlayStatus] = useState<boolean>(false);
    const [videoVolume, setVideoVolume] = useState<number>(50);
    const [videoCurrentLoaded, setVideoCurrentLoaded] = useState<number>(0);
    const [videoCurrentPlayed, setVideoCurrentPlayed] = useState<number>(0);
    const [videoCurrentPlayedSeconds, setVideoCurrentPlayedSeconds] = useState<number>(0);

    //video handlers
    const userVideoPlayStatusHandler = () => {
        if(!videoPlayStatus)
            synchroVideoSeek();
        setVideoPlayStatus(!videoPlayStatus);
    };

    const onProgressHandler = (e:any) => {
        setVideoCurrentPlayed(e.played)
        setVideoCurrentLoaded(e.loaded)
        setVideoCurrentPlayedSeconds(e.playedSeconds)
    };
    
    const inputVolumeHandler = (volume: number) => {
        setVideoVolume(volume/100);
    };


    // sockets

    const synchroVideoSeek = () => {
        socket.emit('get-current-video-data');
    }

    useEffect(() => {
        socket.on('current-video-data', (video: IVideo) => {
            const newTime: number = video?.currentTime || 0; 
            bigPlayer.current?.seekTo(newTime);
            console.log('xD')
        });
        socket.on('server-video-stop',() => {
            if(videoPlayStatus)
                userVideoPlayStatusHandler();    
        });
    
        socket.on('server-video-start',() => {
            if(!videoPlayStatus)
                userVideoPlayStatusHandler();
        });
    },[])

    // console.log('xD reload react plejer');

    return (
        <div className='videoContainer'>
                <ReactPlayer
                    className='reactVideo'
                    width='100%'
                    height='100vh'
                    volume={videoVolume}
                    autoPlay={true}
                    playing={videoPlayStatus}
                    ref={bigPlayer}
                    url={props.currentVideo?.link}
                    onProgress={(e) => {onProgressHandler(e)}}
                />
                <VideoControls 
                    loaded={videoCurrentLoaded}
                    played={videoCurrentPlayed}
                    playedSeconds={videoCurrentPlayedSeconds}
                    videoDuration={props.currentVideo?.duration || 0}
                    fullscreenHandler={props?.fullscreenHandler}
                    videoTitle={props.currentVideo?.title || ''}
                    videoPlay={videoPlayStatus}
                    inputValueHandler={e => inputVolumeHandler(e)}
                    currentVolume={videoVolume}
                    videoStatusHandler={userVideoPlayStatusHandler}
                />
        </div>
    );
}
 
export default VideoReactPlayer;