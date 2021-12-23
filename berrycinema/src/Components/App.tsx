import { io } from 'socket.io-client';

import React, {FC} from 'react';

import VideoPlayer from './VideoPlayer/VideoPlayer';
import './app.scss';
import Queue from './Queue/Queue';
 
export interface IVideo{
    link: string;
    duration: number;
    thumbnail: string;
    title: string;
    description: string;
    startedAt?: string;
    currentTime?: number;
    playing?: boolean;
}

export const socket = io('http://localhost:3001');

const App:FC = () => {
    // socket.on('connect',() => {
    //     socket.emit('get-current-video-data');
    // });

    const addVideoHandler = (link: string, duration: number, thumbnail: string, title: string, description: string) => {
        if(duration !== -1)
        {
            const newVideo: IVideo = {
                link: link,
                duration: duration,
                thumbnail: thumbnail,
                title: title,
                description: description,
            };
            socket.emit('add-video', newVideo);
        }
    };
    console.log('app relog')
    return (
        <div className="main">
            <VideoPlayer />
            <Queue 
                addVideoHandler={addVideoHandler}
            />
        </div>
    );
}
 
export default App;