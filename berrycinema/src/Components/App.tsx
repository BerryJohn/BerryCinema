import { io } from 'socket.io-client';

import React, {FC} from 'react';

import VideoPlayer from './VideoPlayer/VideoPlayer';
import './App.scss';
import Queue from './Queue/Queue';
 
import { serverConfig } from '../serverConfig/config';

export interface IVideo{
    link: string;
    thumbnail: string;
    title: string;

    description?: string;
    duration: number;
    currentTime?: number;

    playing?: boolean;
}

export const socket = io(serverConfig.address);

const App:FC = () => {

    return (
        <div className="main">
            <VideoPlayer />
            <Queue />
        </div>
    );
}
 
export default App;