import React,{FC } from 'react';

import './queue.scss';


interface IQueueElementProps {
    title: string;
    duration: number;
    link: string;
    thumbnail: string;
    description: string;
}
 
const QueueElement: FC<IQueueElementProps> = (props) => {

    return ( 
        <div className='elementWrapper'>
            <div className="image">
                <img src={props.thumbnail} alt='Video thumbnail'/>
            </div>
            <div className="elementInfo">
                <div className="title">{props.title}</div>
                <div className="description">{props.description}</div>
                <div className="duration">{new Date(props.duration * 1000).toISOString().substr(11, 8)}</div>
            </div>

        </div>
     );
}
 
export default QueueElement;