import React,{FC, useEffect, useState} from 'react';

import './Queue.scss';
import {IoAddCircleOutline, IoPerson, IoTimerOutline} from 'react-icons/io5';

import {IVideo, socket} from '../App';
import QueueElement from './QueueElement';
import QueueOptions from './QueueOptions';
import QueueAddVideo from './QueueAddVideo';

 
const Queue: FC = () => {
    //States
    const [videos, setVideos] = useState<IVideo[]>([])
    const [addVideoOpen, setAddVideoOpen] = useState<boolean>(false);
    const [controlVideoOpen, setControlVideoOpen] = useState<boolean>(false);
    const [currentUsers, setCurrentUsers] = useState<number>(0);


    useEffect(() => {
        socket.on('current-video-array', (videosQueue: IVideo[]) => {
            setVideos(videosQueue);
        });
        socket.on('current-users-count', (users)=>{
            setCurrentUsers(users);
        })
    }, [videos]);

    //handlers
    const openVideoHandler = () => {
        setAddVideoOpen(!addVideoOpen);
    };
    const openControlVideoHandler = () => {
        setControlVideoOpen(!controlVideoOpen)
    };

    //Functions
    const countQueueTime = () => {
        let time:number = 0;
        videos.forEach(el => time += el.duration);
        return time;
    };
    return ( 
        <div className='queueWrapper'>
            <QueueOptions optiosOpen={controlVideoOpen}/>
            <QueueAddVideo addVideoOpen={openVideoHandler} isOpen={addVideoOpen}/>

            <div className='queueStats'>
                <div className='videoStats'>
                    <h1>Playlist</h1>
                    <span><IoPerson/>{currentUsers}</span>
                    <span><IoTimerOutline />
                    {new Date(countQueueTime() * 1000).toISOString().substr(11, 8)}
                    </span>
                </div>
                <div className='buttons'>
                    <div className='controlVideoButton' onClick={() => openControlVideoHandler()}>
                        Controls
                    </div>
                    <div className='addVideo' onClick={() => openVideoHandler()}>
                        Add Video <IoAddCircleOutline className='addIcon'/>
                    </div>
                </div>
            </div>

            <div className="line" />

            <div className='queueList'>
                {videos.map((el, id) => (
                    <QueueElement
                        key={`video${el.title}${el.link}`}
                        id={id}
                        title={el.title} 
                        link={el.link} 
                        duration={el.duration} 
                        thumbnail={el.thumbnail} 
                        description={el.description || ''}/>
                ))}
            </div>
        </div>
     );
}
 
export default Queue;