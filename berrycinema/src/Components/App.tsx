import { io } from 'socket.io-client';

import React, {FC} from 'react';

import VideoPlayer from './VideoPlayer/VideoPlayer';
import './app.scss';
import Queue from './Queue/Queue';
 
export interface IVideo{
    link: string;
    thumbnail: string;
    title: string;

    description?: string;
    duration: number;
    currentTime?: number;

    playing?: boolean;
}

export const socket = io('http://maluch.mikr.us:30354');

const App:FC = () => {

    console.log('app relog')
    return (
        <div className="main">
            <VideoPlayer />
            <Queue 
                // addVideoHandler={addVideoHandler}
            />
        </div>
    );
}
 
export default App;