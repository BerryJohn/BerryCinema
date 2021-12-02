import React,{FC, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import getYouTubeID from 'get-youtube-id';

import './queue.scss';
import {BiAddToQueue} from 'react-icons/bi'

import {IVideo} from '../App';
import QueueElement from './QueueElement';

interface QueueProps {
   addVideoHandler(link: string, duration: number, thumbnail: string, title: string): void;
   videosQueue: IVideo[];
}
 
const Queue: FC<QueueProps> = (props) => {
    

    const [addVideoOpen, setAddVideoOpen] = useState<boolean>(false);
    const [linkValue, setLinkValue] = useState<string>('');
    const [titleValue, setTitleValue] = useState<string>('');

    const smallPlayer = useRef<ReactPlayer>(null);
    const titleInput = useRef<HTMLInputElement>(null);
    const linkInput = useRef<HTMLInputElement>(null);

    const addVideoHandler = () => {
        const link = linkValue;
        if(ReactPlayer.canPlay(link))
        {
            const ytid = getYouTubeID(link);
            let thumbnail;
            if(ytid !== null)
                thumbnail = `https://img.youtube.com/vi/${ytid}/0.jpg`;
            else
                thumbnail = 'https://planasa.com/wp-content/uploads/2017/04/frambuesas-adelita.jpg'
            const title = titleValue.slice(0,40);
            props.addVideoHandler(link, smallPlayer.current!.getDuration() || -1, thumbnail, title)
        }
    }

    const openVideoHandler = () => setAddVideoOpen(!addVideoOpen);

    const addVideoButtonHandler = () => {
        addVideoHandler();
        setLinkValue('');
        setTitleValue('');
        openVideoHandler();
    }

    return ( 
        <div className='queueWrapper'>
            <div className={addVideoOpen ? 'addVideoForm addVideoFormActive' : 'addVideoForm'}>
                <div className="addControls">
                    <div>
                        <p>Link:</p>
                        <input type="text" value={linkValue} onChange={e => {setLinkValue(e.target.value)}} required={true} ref={linkInput}/>                        
                    </div>
                    <div>
                        <p>Title:</p>
                        <input type="text" value={titleValue} onChange={e => {setTitleValue(e.target.value)}} required={true} maxLength={40} ref={titleInput}/>                        
                    </div>

                    <button onClick={() => addVideoButtonHandler()}>Add</button>
                </div>
                <ReactPlayer style={{display:'none'}} url={linkValue} height={`300px`} ref={smallPlayer} />
            </div>
            <div className='queueStats'>
                <h1>Playlista</h1>
                <div className='addVideo' onClick={() => openVideoHandler()}>
                    <BiAddToQueue className='addIcon'/>
                </div>
            </div>
            <div className="line" />
            <div className='queueList'>
                {props.videosQueue.map(el => (
                    <QueueElement title={el.title} link={el.link} duration={el.duration} thumbnail={el.thumbnail} />
                ))}
            </div>
        </div>
     );
}
 
export default Queue;