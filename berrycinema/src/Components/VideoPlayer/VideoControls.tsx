import React, {FC, useRef, useState} from 'react';
import './VideoControls.scss';
import {IoPlayOutline, 
        IoVolumeOffOutline, 
        IoExpandOutline,
        IoPauseOutline, 
        IoVolumeMuteOutline, 
        IoVolumeHighOutline, 
        IoVolumeMediumOutline, 
        IoVolumeLowOutline} from 'react-icons/io5';
import { off } from 'process';

interface IVideoControls {
    loaded: number;
    played: number;
    playedSeconds: number;
    videoDuration: number;
    fullscreenHandler: any;
    videoTitle: string;
    videoPlay: boolean;
    currentVolume: number;

    videoStatusHandler(): void;
    inputValueHandler(volume: number): void;
}

let timer: NodeJS.Timeout;
const VideoControls: FC<IVideoControls> = (props) => {
    //refs
    const smallTimeBarRef = useRef<HTMLDivElement>(null);
    const bigTimeBarRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const volumeButtonRef = useRef<HTMLDivElement>(null);
    //states
    const [hidden, setHidden] = useState<boolean>(true);
    //handlers
    const onMouseMoveHandler = () => {
        if(timer != null)
            clearTimeout(timer);

        timer = setTimeout(onMouseMoveLeaveHandler,2000);
        setHidden(false);
    };

    const onMouseMoveLeaveHandler = () => setHidden(true);

    const onMouseClickHandler = (e: React.MouseEvent<HTMLElement>) => {
        if(e.target === controlsRef.current)
            videoStatusHandler();
    };

    const videoStatusHandler = () => props.videoStatusHandler();

    const volumeSliderHandler = (e: any) => {
        localStorage.setItem('videoVolume', `${e.target.value}`);
        props.inputValueHandler(parseInt(e.target.value) - 1);
    }
    const volumeButtonHandler = (e:any, value: number) => {
        if(e.target.className !== 'slider' && e.target.className !== 'volumeSlider')
            {
                if(props.currentVolume <= 0)
                    {
                        if(localStorage.getItem('videoVolume') === null)
                            localStorage.setItem('videoVolume', `50`);
                        const oldVolume = localStorage.getItem('videoVolume');
                        if(oldVolume !== null)
                        {
                            const initialValue = JSON.parse(oldVolume);
                            props.inputValueHandler(initialValue);
                            return;
                        }
                    }
                props.inputValueHandler(value);
            }
    };
    return (
        <div 
            className={
                props.videoPlay  && hidden
                ? 'controlsWrapper cursorHidden' 
                : props.videoPlay 
                ? 'controlsWrapper'
                : 'controlsWrapper controlsPaused'
            }
            onMouseMove={() => {onMouseMoveHandler()}}
            onMouseLeave={() => {onMouseMoveLeaveHandler()}}
            onClick={(e) => {onMouseClickHandler(e)}}
            ref={controlsRef}
        >
            {/* Title */}
            <div className={!hidden || !props.videoPlay ? 'videoTitle' : 'videoTitle videoTitleHidden'}>
                {props.videoTitle}
            </div>
            {/* Middle video status */}
            <div className={!hidden && !props.videoPlay  || !props.videoPlay ? 'midVideoStatus' : 'midVideoStatus midVideoStatusHidden'} onClick={videoStatusHandler}>
                {!props.videoPlay ? <IoPlayOutline /> : <IoPauseOutline />}
            </div>
            {/* SMALL BAR */}
            <div className={hidden && props.videoPlay ? 'smallTimeBar' : 'smallTimeBar hiddenSmallBar'} ref={smallTimeBarRef}>
                <div className='loadedTimeBar' style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * props.loaded}px`}}>
                    <div className="currentTimeBar" style={{width:`${(smallTimeBarRef.current?.offsetWidth || 0) * props.played}px`}} />
                </div>
            </div>
            {/* BIG BAR */}
            <div className={!hidden || !props.videoPlay  ? 'bigBar' : 'bigBar hiddenBigBar'}>
                <div className='videoStatus' onClick={videoStatusHandler}>
                    {!props.videoPlay ? <IoPlayOutline /> : <IoPauseOutline />}
                </div>
                <div className="timers">
                    <span>
                        {new Date(props?.playedSeconds * 1000).toISOString().substr(11, 8)}
                    </span>
                </div>

                <div className="bigTimeBar" ref={bigTimeBarRef}>
                    <div className="loadedTimeBar" style={{width:`${(bigTimeBarRef.current?.offsetWidth || 0) * props.loaded}px`}}>
                        <div className="currentTimeBar" style={{width:`${(bigTimeBarRef.current?.offsetWidth || 0) * props.played}px`}}/>
                    </div>
                </div>

                <div className="timers">
                    <span>
                        {new Date(props?.videoDuration * 1000).toISOString().substr(11, 8)}
                    </span>
                </div>
                <div 
                    className="volume"
                    ref={volumeButtonRef}
                    onClick={(e) => volumeButtonHandler(e, 0)}
                >   
                    { props.currentVolume <= 0 ? <IoVolumeMuteOutline /> : 
                                props.currentVolume > 0.75 ? <IoVolumeHighOutline/> : 
                                props.currentVolume > 0.50 ? <IoVolumeMediumOutline/> : 
                                props.currentVolume > 0.25 ? <IoVolumeLowOutline/> :
                                <IoVolumeOffOutline />  }
                    <div className='volumeSlider'>
                        <input 
                            className='slider'
                            type='range'
                            min='-1'
                            max='100'
                            value={props.currentVolume * 100}
                            onChange={volumeSliderHandler}
                            style={{backgroundImage: `linear-gradient(90deg, rgba(175, 17, 109, 1) ${props.currentVolume * 100}%, rgba(212, 212, 212, 0.616) ${props.currentVolume * 100}%)`}}
                        />
                    </div>
                </div>
                <div className='fullscreen' onClick={!props.fullscreenHandler.active ? props.fullscreenHandler.enter : props.fullscreenHandler.exit}>
                    <IoExpandOutline />
                </div>
            </div>
            {/* END OF BIG BAR */}
        </div>
    );
}
 
export default VideoControls;