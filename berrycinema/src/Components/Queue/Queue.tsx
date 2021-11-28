import React,{FC, useRef, useState} from 'react';
import ReactPlayer from 'react-player';

import {IVideo} from '../App';

interface QueueProps {
   addVideoHandler(link: string, duration: number): void;
   videosQueue: IVideo[];
}
 
const Queue: FC<QueueProps> = (props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const smallPlayer = useRef<ReactPlayer>(null);

    return ( 
        <div>
            <ReactPlayer url={inputValue} height={`300px`} ref={smallPlayer}/>
            <input type="text" onChange={e => {setInputValue(e.target.value)}}/>
            <button onClick={() => props.addVideoHandler(inputValue, smallPlayer.current!.getDuration() || -1)}>Add</button>
            <div>
                {props.videosQueue.map(el => (
                    <div>
                        {el?.link}
                    </div>
                ))}
            </div>
        </div>
     );
}
 
export default Queue;