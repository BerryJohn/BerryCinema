import { io } from 'socket.io-client';

import React, {FC, useEffect, useState} from 'react';

import VideoPlayer from './VideoPlayer/VideoPlayer';
import './App.scss';
import Queue from './Queue/Queue';
 
export interface IVideo{
    link: string;
    startedAt: string;
}

const socket = io('http://localhost:3001');

socket.on('hello',(message: string) => {
    console.log(message);
})

const App:FC = () => {
    const [videos, setVideos] = useState<IVideo[]>([])

    useEffect(() => {
        socket.on('current-videos', (currentVideo: IVideo[]) =>{
            if(currentVideo)
                setVideos(currentVideo);
            else
                setVideos([]);
        });
    }, [videos]);

    const addVideoHandler = (link: string) => {
        socket.emit('add-video', (link));
    }

    return (
        <div className="main">
            <VideoPlayer currentVideo={videos[0]?.link}/>
            <Queue 
                addVideoHandler={addVideoHandler}
                videosQueue={videos}
            />
        </div>
    );
}
 
export default App;