import React, {FC, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import { IVideo, socket } from '../App';
import VideoControls from './VideoControls';

interface IVideoReactPlayer {
    currentVideo?: IVideo;
    fullscreenHandler: any;
}

let wasReady: boolean = false;
 
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

    const serverVideoPlayStatusHandler = (status: boolean) => {
        if(status === true)
            synchroVideoSeek();
        setVideoPlayStatus(status);
    };

    const onProgressHandler = (e:any) => {
        setVideoCurrentPlayed(e.played)
        setVideoCurrentLoaded(e.loaded)
        setVideoCurrentPlayedSeconds(e.playedSeconds)
    };
    
    const inputVolumeHandler = (volume: number) => {
        setVideoVolume(volume/100);
    };

    const onReadyHandler = () => {
        if(!wasReady)//Player had problem with this
        {
            socket.emit('get-current-video-data');
            wasReady = true;
        }
    }

    // sockets
    const synchroVideoSeek = () => {
        socket.emit('get-current-video-data');
    }

    useEffect(() => {
        socket.on('current-video-data', (video: IVideo) => {
            const newTime: number = video?.currentTime || 0;
            bigPlayer.current?.seekTo(newTime);
        });

        socket.on('server-video-stop',() => {
            // if(videoPlayStatus)
                serverVideoPlayStatusHandler(false);
        });
    
        socket.on('server-video-start',() => {
            if(!videoPlayStatus)
                serverVideoPlayStatusHandler(true);
        });

        socket.on('end-of-queue', () => {
            setVideoCurrentLoaded(0);
            setVideoCurrentPlayed(0);
            setVideoCurrentPlayedSeconds(0);
        });
    },[])

    return (
        <div>
                <ReactPlayer
                    className='reactVideo'
                    width='100%'
                    height='100vh'
                    volume={videoVolume}
                    autoPlay={true}
                    playing={videoPlayStatus}
                    ref={bigPlayer}
                    url={props.currentVideo?.link}
                    onProgress={(e) => onProgressHandler(e)}
                    onReady={() => onReadyHandler()}
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