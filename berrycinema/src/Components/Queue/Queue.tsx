import React,{FC, useState} from 'react';
import {IVideo} from '../App'

interface QueueProps {
   addVideoHandler(link: string): void;
   videosQueue: IVideo[];
}
 
const Queue: FC<QueueProps> = (props) => {
    const [inputValue, setInputValue] = useState<string>('');

    return ( 
        <div>
            <input type="text" onChange={e => {setInputValue(e.target.value)}}/>
            <button onClick={() => props.addVideoHandler(inputValue)}>Add</button>
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