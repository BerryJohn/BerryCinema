import { io } from 'socket.io-client';

import React, {FC, useEffect, useState} from 'react';

import VideoPlayer from './VideoPlayer/VideoPlayer';
import './App.scss';
import Queue from './Queue/Queue';
 
export interface IVideo{
    link: string;
    duration: number;
    startedAt?: string;
    currentTime?: number;
}

const socket = io('http://localhost:3001');

const App:FC = () => {
    const [videos, setVideos] = useState<IVideo[]>([])

    useEffect(() => {
        socket.on('current-videos', (currentVideos: IVideo[]) =>{
            if(currentVideos)
                setVideos(currentVideos);
            else
                setVideos([]);
        });
    }, [videos]);

    const addVideoHandler = (link: string, duration: number) => {
        if(duration != -1)
        {
            const newVideo: IVideo = {
                link: link,
                duration: duration
            }; 
            socket.emit('add-video', newVideo);
        }
    }

    return (
        <div className="main">
            <VideoPlayer 
                currentVideo={videos[0]}
                socket={socket}    
            />
            <Queue 
                addVideoHandler={addVideoHandler}
                videosQueue={videos}
            />
        </div>
    );
}
 
export default App;